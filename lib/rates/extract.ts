import type { ExtractedRateQuote, RateScrapeOutcome, RateSourceRecord } from "@/lib/rates/types";

const RATE_KEYWORDS = ["rate", "interest", "apr", "mortgage", "fixed", "arm", "physician", "doctor", "professional"];
const BLOCKED_KEYWORDS = ["access denied", "captcha", "verify you are human", "request blocked", "unusual traffic"];

export function extractRateOutcomeFromHtml(html: string, source: RateSourceRecord): RateScrapeOutcome {
  return extractRateOutcomeFromText(extractVisibleTextFromHtml(html), source);
}

export function extractRateOutcomeFromText(text: string, source: RateSourceRecord): RateScrapeOutcome {
  const normalized = normalizeWhitespace(text);
  if (isBlockedText(normalized)) {
    return {
      status: "blocked",
      quotes: [],
      rawText: normalized.slice(0, 5000),
      errorMessage: "The page appears to block automated access or require human verification.",
    };
  }

  const quotes = dedupeQuotes([...buildSentenceRateQuotes(normalized, source), ...buildStructuredQuotes(normalized, source), buildBestQuote(normalized, source)].filter(Boolean) as ExtractedRateQuote[]);
  if (!quotes.length) {
    return {
      status: "no_rate_found",
      quotes: [],
      rawText: normalized.slice(0, 5000),
      metadata: { reason: "No mortgage rate-like percentages were found near relevant keywords." },
    };
  }

  return {
    status: "success",
    quotes,
    rawText: quotes[0].rawText,
  };
}

export function extractVisibleTextFromHtml(html: string) {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<head[\s\S]*?<\/head>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  return decodeHtmlEntities(withoutNoise);
}

function buildBestQuote(text: string, source: RateSourceRecord): ExtractedRateQuote | null {
  const percentageMatches = [...text.matchAll(/(?<!\d)(\d{1,2}(?:\.\d{1,3})?)\s*%/g)]
    .map((match) => {
      const value = Number(match[1]);
      const index = match.index ?? 0;
      const context = text.slice(Math.max(0, index - 180), Math.min(text.length, index + 220));
      return { value, index, context, lowerContext: context.toLowerCase() };
    })
    .filter((match) => match.value >= 2 && match.value <= 15)
    .filter((match) => RATE_KEYWORDS.some((keyword) => match.lowerContext.includes(keyword)))
    .filter((match) => isActualRateContext(match.context));

  if (!percentageMatches.length) return null;

  const aprCandidate = scorePercentCandidates(percentageMatches.filter((match) => /\bapr\b/i.test(match.context)))[0];
  const rateCandidate = scorePercentCandidates(
    percentageMatches.filter((match) => !/\bapr\b/i.test(match.context) || /\binterest\b|\brate\b|\bfixed\b|\barm\b/i.test(match.context)),
  )[0];
  const anchor = rateCandidate ?? aprCandidate ?? percentageMatches[0];
  const rawText = expandContext(text, anchor.index, 520);
  const rate = rateCandidate?.value ?? null;
  const apr = aprCandidate?.value ?? inferApr(rate, rawText);
  const points = extractNumberAfter(rawText, /points?\s*:?\s*/i);
  const monthlyPayment = extractMoneyAfter(rawText, /(?:monthly|mo\.?\s*payment|payment)\D{0,40}/i);
  const closingFees = extractMoneyAfter(rawText, /(?:closing|upfront|total)\s+(?:costs?|fees?)\D{0,40}/i);
  const lenderFees = extractMoneyAfter(rawText, /lender\s+fees?\D{0,40}/i);
  const thirdPartyFees = extractMoneyAfter(rawText, /third[-\s]?party\D{0,40}/i);

  const confidence =
    0.35 +
    (rate ? 0.18 : 0) +
    (apr ? 0.18 : 0) +
    (monthlyPayment ? 0.08 : 0) +
    (closingFees ? 0.08 : 0) +
    (rawText.toLowerCase().includes("doctor") || rawText.toLowerCase().includes("physician") || rawText.toLowerCase().includes("professional") ? 0.08 : 0);

  return {
    loanProduct: inferLoanProduct(rawText, source),
    interestRate: rate,
    apr,
    points,
    monthlyPayment,
    closingFees,
    lenderFees,
    thirdPartyFees,
    confidence: Math.min(0.95, Number(confidence.toFixed(2))),
    rawText,
    metadata: {
      matchedPercentages: percentageMatches.slice(0, 10).map((match) => match.value),
      extractionVersion: 1,
      sourceKind: getSourceKind(source),
      asOf: extractAsOf(rawText),
    },
  };
}

function buildSentenceRateQuotes(text: string, source: RateSourceRecord): ExtractedRateQuote[] {
  const patterns = [
    /(\d{1,2}(?:\.\d{1,3})?)\s*%\s+interest\s+rate\s+with\s+(?:an\s+)?(?:associated\s+)?APR\s+(?:of\s+)?(\d{1,2}(?:\.\d{1,3})?)\s*%/gi,
    /Rate\s+(\d{1,2}(?:\.\d{1,3})?)\s*%\s+with\s+(?:an\s+)?APR\s+of\s+(\d{1,2}(?:\.\d{1,3})?)\s*%/gi,
    /(\d{1,2}(?:\.\d{1,3})?)\s*%\s+rate\s+(?:and|with)\s+(\d{1,2}(?:\.\d{1,3})?)\s*%\s+APR/gi,
  ];

  return patterns.flatMap((pattern) =>
    [...text.matchAll(pattern)].map((match) => {
      const index = match.index ?? 0;
      const rawText = expandContext(text, index, 520);
      const monthlyPayment = extractMoneyAfter(rawText, /(?:payment|payments?)\D{0,80}/i);
      return {
        loanProduct: inferLoanProduct(rawText, source),
        interestRate: Number(match[1]),
        apr: Number(match[2]),
        points: extractNumberAfter(rawText, /points?\s*(?:of|:)?\s*/i),
        monthlyPayment,
        closingFees: extractMoneyAfter(rawText, /(?:closing|upfront|total)\s+(?:costs?|fees?)\D{0,40}/i),
        lenderFees: extractMoneyAfter(rawText, /origination\s+fee\D{0,40}/i),
        thirdPartyFees: null,
        confidence: 0.96,
        rawText,
        metadata: {
          extractionVersion: 3,
          sourceKind: getSourceKind(source),
          expectedLoanProduct: getExpectedLoanProduct(source),
          asOf: extractAsOf(rawText) ?? extractAsOf(text),
        },
      };
    }),
  );
}

function buildStructuredQuotes(text: string, source: RateSourceRecord): ExtractedRateQuote[] {
  const products = [
    { label: "30 year fixed", pattern: /30[-\s]?year(?:\s+fixed)?/gi },
    { label: "20 year fixed", pattern: /20[-\s]?year(?:\s+fixed)?/gi },
    { label: "15 year fixed", pattern: /15[-\s]?year(?:\s+fixed)?/gi },
    { label: "10 year fixed", pattern: /10[-\s]?year(?:\s+fixed)?/gi },
    { label: "5/1 ARM", pattern: /5\/1\s+arm|5[-\s]?year\s+arm/gi },
    { label: "7/1 ARM", pattern: /7\/1\s+arm|7[-\s]?year\s+arm/gi },
    { label: "10/1 ARM", pattern: /10\/1\s+arm|10[-\s]?year\s+arm/gi },
    { label: "Medical Professional", pattern: /medical\s+professional/gi },
    { label: "Physician loan", pattern: /physician\s+loan|physician\s+mortgage/gi },
    { label: "Professional Mortgage", pattern: /professional\s+mortgage|professional\s+loan/gi },
  ];

  const productHits = products.flatMap((product) => {
    return [...text.matchAll(product.pattern)].map((match) => ({
      label: product.label,
      index: match.index ?? 0,
    }));
  }).sort((a, b) => a.index - b.index);

  const quotes: ExtractedRateQuote[] = [];
  for (let index = 0; index < productHits.length; index += 1) {
    const hit = productHits[index];
    const nextHit = productHits[index + 1];
    const segment = text.slice(hit.index, Math.min(text.length, nextHit ? nextHit.index : hit.index + 700));
    const percentMatches = [...segment.matchAll(/(?<!\d)(\d{1,2}(?:\.\d{1,3})?)\s*%/g)]
      .map((match) => ({
        value: Number(match[1]),
        index: match.index ?? 0,
        context: segment.slice(Math.max(0, (match.index ?? 0) - 80), Math.min(segment.length, (match.index ?? 0) + 120)),
      }))
      .filter((match) => match.value >= 2 && match.value <= 15);

    if (!percentMatches.length) continue;

    const aprMatch = percentMatches.find((match) => /\bapr\b/i.test(match.context) && isActualRateContext(match.context)) ?? null;
    const rateMatch = percentMatches.find((match) => !/\bapr\b/i.test(match.context) && isActualRateContext(match.context)) ?? null;
    if (!rateMatch && !aprMatch) continue;

    const paymentSegment = aprMatch ? segment.slice(aprMatch.index) : segment;
    const monthlyPayment = extractFirstMoney(paymentSegment);
    const closingFees = extractMoneyAfter(segment, /(?:closing|upfront|total)\s+(?:costs?|fees?)\D{0,40}/i);
    const points = extractNumberAfter(segment, /points?\s*(?:of|:)?\s*/i);
    const rawText = segment.slice(0, 900).trim();
    const confidence =
      0.5 +
      (rateMatch ? 0.14 : 0) +
      (aprMatch ? 0.14 : 0) +
      (monthlyPayment ? 0.08 : 0) +
      (/\brate\b|\bapr\b/i.test(segment) ? 0.08 : 0) +
      (/\bdoctor\b|\bphysician\b|\bprofessional\b|\bmedical\b/i.test(segment) ? 0.06 : 0);

    quotes.push({
      loanProduct: hit.label,
      interestRate: rateMatch?.value ?? null,
      apr: aprMatch?.value ?? inferApr(rateMatch?.value ?? null, segment),
      points,
      monthlyPayment,
      closingFees,
      lenderFees: null,
      thirdPartyFees: null,
      confidence: Math.min(0.97, Number(confidence.toFixed(2))),
      rawText,
      metadata: {
        extractionVersion: 2,
        sourceKind: getSourceKind(source),
        expectedLoanProduct: getExpectedLoanProduct(source),
        asOf: extractAsOf(segment) ?? extractAsOf(text),
      },
    });
  }

  return quotes;
}

function dedupeQuotes(quotes: ExtractedRateQuote[]) {
  const seen = new Set<string>();
  return quotes
    .filter((quote) => quote.interestRate || quote.apr)
    .sort((a, b) => b.confidence - a.confidence)
    .filter((quote) => {
      const key = `${quote.loanProduct ?? ""}:${quote.interestRate ?? ""}:${quote.apr ?? ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}

function scorePercentCandidates<T extends { context: string; lowerContext: string; value: number }>(candidates: T[]) {
  return candidates
    .map((candidate) => {
      let score = 0;
      if (/\bapr\b/i.test(candidate.context)) score += 3;
      if (/\brate\b|\binterest\b/i.test(candidate.context)) score += 2;
      if (/\bfixed\b|\barm\b|\b30[-\s]?year\b|\b15[-\s]?year\b/i.test(candidate.context)) score += 2;
      if (/\bdoctor\b|\bphysician\b|\bprofessional\b/i.test(candidate.context)) score += 2;
      if (candidate.value >= 3 && candidate.value <= 9) score += 1;
      return { ...candidate, score };
    })
    .sort((a, b) => b.score - a.score);
}

function isActualRateContext(context: string) {
  const lower = context.toLowerCase();
  const hasRateSignal =
    /\bapr\b/.test(lower) ||
    /\binterest\s+rate\b/.test(lower) ||
    /\brate\s+(?:with|and|is|of|for|information|quote|quotes|table|as\s+of)\b/.test(lower) ||
    /\bcurrent\s+(?:mortgage\s+)?rates?\b/.test(lower);
  const hasFalsePositiveSignal =
    /\bdown\s+payment\b/.test(lower) ||
    /\bfinancing\b/.test(lower) ||
    /\bcredit\s+cards?\b/.test(lower) ||
    /\bcash\s+back\b/.test(lower) ||
    /\bannual\s+fee\b/.test(lower) ||
    /\bclosing\s+cost\s+discount\b/.test(lower);
  return hasRateSignal && !hasFalsePositiveSignal;
}

function inferApr(rate: number | null, rawText: string) {
  if (!rate || !/\bapr\b/i.test(rawText)) return null;
  return Number((rate + 0.18).toFixed(3));
}

function inferLoanProduct(rawText: string, source: RateSourceRecord) {
  if (/15[-\s]?year/i.test(rawText)) return "15 year fixed";
  if (/20[-\s]?year/i.test(rawText)) return "20 year fixed";
  if (/5\/1|5[-\s]?year\s+arm/i.test(rawText)) return "5/1 ARM";
  if (/7\/1|7[-\s]?year\s+arm/i.test(rawText)) return "7/1 ARM";
  if (/10\/1|10[-\s]?year\s+arm/i.test(rawText)) return "10/1 ARM";
  if (/30[-\s]?year/i.test(rawText)) return "30 year fixed";
  return source.programName ?? "Professional mortgage";
}

function extractNumberAfter(text: string, label: RegExp) {
  const index = text.search(label);
  if (index < 0) return null;
  const segment = text.slice(index, index + 90);
  const match = segment.match(/(\d{1,2}(?:\.\d{1,3})?)/);
  return match ? Number(match[1]) : null;
}

function extractMoneyAfter(text: string, label: RegExp) {
  const index = text.search(label);
  if (index < 0) return null;
  const segment = text.slice(index, index + 120);
  const match = segment.match(/\$\s*([\d,]+)/);
  return match ? Number(match[1].replace(/,/g, "")) : null;
}

function extractFirstMoney(text: string) {
  const match = text.match(/\$\s*([\d,]+)(?:\.\d{2})?/);
  return match ? Number(match[1].replace(/,/g, "")) : null;
}

function expandContext(text: string, index: number, radius: number) {
  return text.slice(Math.max(0, index - radius), Math.min(text.length, index + radius)).trim();
}

function isBlockedText(text: string) {
  const lower = text.slice(0, 3000).toLowerCase();
  return BLOCKED_KEYWORDS.some((keyword) => lower.includes(keyword));
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function getSourceKind(source: RateSourceRecord) {
  const value = source.selectorHints?.sourceKind;
  return typeof value === "string" ? value : null;
}

function getExpectedLoanProduct(source: RateSourceRecord) {
  const value = source.selectorHints?.expectedLoanProduct;
  return typeof value === "string" ? value : null;
}

function extractAsOf(text: string) {
  const match = text.match(/\bas\s+of\s+([A-Za-z]+\s+\d{1,2},\s+\d{4}(?:\s+\d{1,2}:\d{2}\s*(?:AM|PM)?\s*(?:UTC|ET|CT|PT)?)?)/i);
  return match?.[1] ?? null;
}
