import { closeDb } from "@/lib/db";
import { createRateScrapeRun, ensureDefaultRateSources, finishRateScrapeRun, recordRateSnapshot } from "@/lib/services/rateScrapes";
import { scrapeRateSourceWithBrowser } from "@/lib/rates/scrapeBrowser";
import { scrapeRateSourceWithFetch } from "@/lib/rates/scrapeFetch";
import type { RateScrapeMethod, RateScrapeTrigger, RateSourceRecord, RunMortgageRateScrapeOptions, RunMortgageRateScrapeResult } from "@/lib/rates/types";

const DEFAULT_DELAY_MS = 1500;

export async function runMortgageRateScrape(options: RunMortgageRateScrapeOptions = {}): Promise<RunMortgageRateScrapeResult> {
  const modeOverride = options.mode ?? getConfiguredModeOverride();
  const mode = modeOverride ?? "fetch_html";
  const trigger = options.trigger ?? "manual";
  const sources = (await ensureDefaultRateSources())
    .filter((source) => (options.programType ? source.programType === options.programType : true))
    .slice(0, options.sourceLimit);
  const run = options.dryRun ? null : await createRateScrapeRun({ trigger, mode, totalSources: sources.length });
  let successfulSources = 0;
  let failedSources = 0;
  let snapshotsWritten = 0;

  for (const source of sources) {
    const outcome = await scrapeSource(source, modeOverride);
    if (outcome.status === "success") successfulSources += 1;
    else failedSources += 1;

    if (!options.dryRun) {
      if (outcome.quotes.length) {
        for (const quote of outcome.quotes.slice(0, 3)) {
          await recordRateSnapshot({
            runId: run?.id,
            source,
            status: outcome.status,
            quote,
            rawText: outcome.rawText,
            errorMessage: outcome.errorMessage,
            metadata: outcome.metadata,
          });
          snapshotsWritten += 1;
        }
      } else {
        await recordRateSnapshot({
          runId: run?.id,
          source,
          status: outcome.status,
          rawText: outcome.rawText,
          errorMessage: outcome.errorMessage,
          metadata: outcome.metadata,
        });
        snapshotsWritten += 1;
      }
    }

    await delay(getDelayMs());
  }

  if (!options.dryRun) {
    await finishRateScrapeRun({
      runId: run?.id,
      successfulSources,
      failedSources,
      notes: `Completed ${modeOverride ?? "source-configured"} scrape for ${sources.length} source(s).`,
    });
  }

  return {
    runId: run?.id ?? null,
    mode,
    trigger,
    totalSources: sources.length,
    successfulSources,
    failedSources,
    snapshotsWritten,
  };
}

export async function runMortgageRateScrapeAndClose(options: RunMortgageRateScrapeOptions = {}) {
  try {
    return await runMortgageRateScrape(options);
  } finally {
    await closeDb();
  }
}

async function scrapeSource(source: RateSourceRecord, modeOverride?: RateScrapeMethod) {
  const method = modeOverride ?? source.scrapeMethod;
  return method === "browser" ? scrapeRateSourceWithBrowser(source) : scrapeRateSourceWithFetch(source);
}

function getConfiguredModeOverride(): RateScrapeMethod | undefined {
  if (process.env.RATE_SCRAPER_MODE === "browser") return "browser";
  if (process.env.RATE_SCRAPER_MODE === "fetch_html") return "fetch_html";
  return undefined;
}

function getDelayMs() {
  const parsed = Number(process.env.RATE_SCRAPER_DELAY_MS);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_DELAY_MS;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function triggerForHour(hour: number): RateScrapeTrigger {
  if (hour === 10) return "schedule_10am";
  if (hour === 15) return "schedule_3pm";
  return "manual";
}
