import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright-core";
import { extractRateOutcomeFromText } from "@/lib/rates/extract";
import type { RateScrapeOutcome, RateSourceRecord } from "@/lib/rates/types";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36 ProLoanMatchRateResearch/1.0";

type BrowserLaunchOptions = NonNullable<Parameters<typeof chromium.launchPersistentContext>[1]>;

export async function scrapeRateSourceWithBrowser(source: RateSourceRecord): Promise<RateScrapeOutcome> {
  const profileDir = resolve(process.env.RATE_SCRAPER_PROFILE_DIR ?? ".rate-scraper-chrome-profile");
  await mkdir(profileDir, { recursive: true });

  const headless = process.env.RATE_SCRAPER_HEADLESS === "false" || process.env.RATE_SCRAPER_HEADLESS === "0" ? false : true;
  const launchOptions: BrowserLaunchOptions = {
    headless,
    viewport: { width: 1280, height: 900 },
    userAgent: process.env.RATE_SCRAPER_USER_AGENT ?? DEFAULT_USER_AGENT,
    locale: "en-US",
  };

  if (process.env.RATE_SCRAPER_CHROME_PATH) {
    launchOptions.executablePath = process.env.RATE_SCRAPER_CHROME_PATH;
  } else {
    launchOptions.channel = "chrome";
  }

  let context: Awaited<ReturnType<typeof chromium.launchPersistentContext>> | null = null;
  try {
    context = await chromium.launchPersistentContext(profileDir, launchOptions);
    const page = context.pages()[0] ?? (await context.newPage());
    await page.goto(source.sourceUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => undefined);
    const text = await page.locator("body").innerText({ timeout: 12000 });
    const outcome = extractRateOutcomeFromText(text, source);
    return {
      ...outcome,
      metadata: {
        ...(outcome.metadata ?? {}),
        finalUrl: page.url(),
        mode: "browser",
        headless,
      },
    };
  } catch (error) {
    return {
      status: "error",
      quotes: [],
      errorMessage: error instanceof Error ? error.message : "Unknown browser scraper error.",
      metadata: { mode: "browser", headless },
    };
  } finally {
    await context?.close().catch(() => undefined);
  }
}
