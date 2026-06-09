import type { LoanProgramType } from "@/lib/types";

export type RateScrapeMethod = "fetch_html" | "browser";
export type RateScrapeTrigger = "manual" | "schedule_10am" | "schedule_3pm";
export type RateScrapeStatus = "success" | "no_rate_found" | "blocked" | "error";

export type RateSourceSeed = {
  programSlug: string;
  lenderName: string;
  programName?: string | null;
  programType: LoanProgramType;
  sourceUrl: string;
  scrapeMethod: RateScrapeMethod;
  selectorHints?: Record<string, unknown>;
  notes?: string | null;
};

export type RateSourceRecord = RateSourceSeed & {
  id?: string;
  isActive?: boolean;
};

export type ExtractedRateQuote = {
  loanProduct?: string | null;
  interestRate?: number | null;
  apr?: number | null;
  points?: number | null;
  monthlyPayment?: number | null;
  closingFees?: number | null;
  lenderFees?: number | null;
  thirdPartyFees?: number | null;
  confidence: number;
  rawText: string;
  metadata?: Record<string, unknown>;
};

export type RateScrapeOutcome = {
  status: RateScrapeStatus;
  quotes: ExtractedRateQuote[];
  rawText?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
};

export type RunMortgageRateScrapeOptions = {
  trigger?: RateScrapeTrigger;
  mode?: RateScrapeMethod;
  sourceLimit?: number;
  dryRun?: boolean;
};

export type RunMortgageRateScrapeResult = {
  runId?: string | null;
  mode: RateScrapeMethod;
  trigger: RateScrapeTrigger;
  totalSources: number;
  successfulSources: number;
  failedSources: number;
  snapshotsWritten: number;
};
