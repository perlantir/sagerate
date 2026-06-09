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

  const quote = buildBestQuote(normalized, source);
  if (!quote) {
    return {
      status: "no_rate_found",
      quotes: [],
      rawText: normalized.slice(0, 5000),
      metadata: { reason: "No mortgage rate-like percentages were found near relevant keywords." },
    };
  }

  return {
    status: "success",
    quotes: [quote],
    rawText: quote.rawText,
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
    .filter((match) => RATE_KEYWORDS.some((keyword) => match.lowerContext.includes(keyword)));

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
    },
  };
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
