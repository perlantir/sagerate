import { extractRateOutcomeFromHtml } from "@/lib/rates/extract";
import type { RateScrapeOutcome, RateSourceRecord } from "@/lib/rates/types";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 ProLoanMatchRateResearch/1.0";

export async function scrapeRateSourceWithFetch(source: RateSourceRecord): Promise<RateScrapeOutcome> {
  try {
    const response = await fetch(source.sourceUrl, {
      redirect: "follow",
      headers: {
        "user-agent": process.env.RATE_SCRAPER_USER_AGENT ?? DEFAULT_USER_AGENT,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    const html = await response.text();

    if (response.status === 401 || response.status === 403 || response.status === 429) {
      return {
        status: "blocked",
        quotes: [],
        rawText: html.slice(0, 5000),
        errorMessage: `HTTP ${response.status} from source page.`,
        metadata: { httpStatus: response.status },
      };
    }

    if (!response.ok) {
      return {
        status: "error",
        quotes: [],
        rawText: html.slice(0, 5000),
        errorMessage: `HTTP ${response.status} from source page.`,
        metadata: { httpStatus: response.status },
      };
    }

    const outcome = extractRateOutcomeFromHtml(html, source);
    return {
      ...outcome,
      metadata: {
        ...(outcome.metadata ?? {}),
        httpStatus: response.status,
        finalUrl: response.url,
      },
    };
  } catch (error) {
    return {
      status: "error",
      quotes: [],
      errorMessage: error instanceof Error ? error.message : "Unknown fetch scraper error.",
    };
  }
}
