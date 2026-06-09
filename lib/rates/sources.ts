import { LENDER_PROGRAMS } from "@/lib/constants/programs";
import type { RateSourceSeed } from "@/lib/rates/types";

export const DEFAULT_RATE_SOURCES: RateSourceSeed[] = LENDER_PROGRAMS.map((program) => ({
  programSlug: program.id,
  lenderName: program.lenderName,
  programName: program.programName,
  programType: program.programType,
  sourceUrl: program.lenderWebsiteUrl ?? "https://example.com",
  scrapeMethod: "fetch_html",
  selectorHints: {
    includeKeywords: buildKeywords(program.lenderName, program.programName),
  },
  notes: "Initial public source seed. Replace sourceUrl with the lender's exact public professional/doctor mortgage rate page when available.",
}));

export function getConfiguredRateSources() {
  const overrides = parseSourceOverrides(process.env.RATE_SCRAPER_SOURCE_OVERRIDES);
  if (!overrides.length) return DEFAULT_RATE_SOURCES;
  return DEFAULT_RATE_SOURCES.map((source) => {
    const override = overrides.find((item) => item.programSlug === source.programSlug);
    return override ? { ...source, ...override } : source;
  });
}

function buildKeywords(lenderName: string, programName?: string | null) {
  return [
    lenderName,
    programName,
    "mortgage",
    "rate",
    "APR",
    "doctor",
    "physician",
    "professional",
  ].filter(Boolean);
}

function parseSourceOverrides(value: string | undefined): Partial<RateSourceSeed>[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is Partial<RateSourceSeed> & { programSlug: string } => {
      return Boolean(item && typeof item === "object" && "programSlug" in item && typeof item.programSlug === "string");
    });
  } catch {
    return [];
  }
}
