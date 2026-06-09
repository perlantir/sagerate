import { LENDER_PROGRAMS } from "@/lib/constants/programs";
import type { RateSourceSeed } from "@/lib/rates/types";

type SourceOverride = Pick<RateSourceSeed, "sourceUrl" | "scrapeMethod" | "notes"> & {
  sourceKind: "professional_program" | "doctor_program" | "generic_lender_rates" | "program_details";
  expectedLoanProduct?: string;
};

const PUBLIC_SOURCE_OVERRIDES: Record<string, SourceOverride> = {
  "fifth-third-doctor-dentist": {
    sourceUrl: "https://www.53.com/content/fifth-third/en/personal-banking/borrowing-basics/mortgage/physician-loan.html",
    scrapeMethod: "fetch_html",
    sourceKind: "doctor_program",
    expectedLoanProduct: "Physician loan",
    notes: "Official physician loan program page. Public page describes program terms; exact live rates may not be published.",
  },
  "keybank-professional": {
    sourceUrl: "https://www.key.com/personal/home-loans-lines/mortgage/professional-mortgages.html",
    scrapeMethod: "fetch_html",
    sourceKind: "professional_program",
    expectedLoanProduct: "Medical Professional Loans",
    notes: "Official professional mortgage page. Public page describes program terms; exact live rates may not be published.",
  },
  "truist-doctor-loan": {
    sourceUrl: "https://www.truist.com/mortgage/current-mortgage-rates",
    scrapeMethod: "fetch_html",
    sourceKind: "generic_lender_rates",
    expectedLoanProduct: "30 year fixed",
    notes: "Official Truist current mortgage rates page. Doctor loan terms are on /mortgage/doctor-loan; rate table may be generic mortgage pricing.",
  },
  "first-horizon-medical": {
    sourceUrl: "https://www.firsthorizon.com/Personal/Products-and-Services/Borrowing/Mortgage/Mortgage-Options",
    scrapeMethod: "fetch_html",
    sourceKind: "program_details",
    expectedLoanProduct: "Medical professional mortgage",
    notes: "Official mortgage options page mentioning medical professionals. Exact live doctor-loan rates may not be published.",
  },
  "citizens-professional": {
    sourceUrl: "https://www.citizensbank.com/loans/home-mortgage.aspx",
    scrapeMethod: "fetch_html",
    sourceKind: "generic_lender_rates",
    expectedLoanProduct: "30 year fixed",
    notes: "Official Citizens mortgage rates page. Doctor loan details are published separately; rates may be generic mortgage pricing.",
  },
  "td-bank-medical": {
    sourceUrl: "https://www.td.com/us/en/personal-banking/medical-professional-mortgage",
    scrapeMethod: "fetch_html",
    sourceKind: "doctor_program",
    expectedLoanProduct: "Medical Professional Mortgage",
    notes: "Official TD medical professional mortgage page. Public page describes program terms; exact live rates may not be published.",
  },
  "pnc-medical-professional": {
    sourceUrl: "https://www.pnc.com/en/personal-banking/borrowing/home-lending/mortgage-loans/specialized-loan-rates.html",
    scrapeMethod: "fetch_html",
    sourceKind: "doctor_program",
    expectedLoanProduct: "Medical Professional",
    notes: "Official PNC specialized loan rates page with Medical Professional mortgage content.",
  },
  "flagstar-professional": {
    sourceUrl: "https://www.flagstar.com/personal/borrow/home-loans/mortgage-rates.html",
    scrapeMethod: "fetch_html",
    sourceKind: "generic_lender_rates",
    expectedLoanProduct: "30 year fixed",
    notes: "Official Flagstar mortgage rates page. Professional loan program page exists separately; rates may be generic mortgage pricing.",
  },
  "bmo-medical": {
    sourceUrl: "https://www.bmo.com/en-us/main/personal/mortgages/housecall/",
    scrapeMethod: "fetch_html",
    sourceKind: "doctor_program",
    expectedLoanProduct: "Physicians' Mortgage Program",
    notes: "Official BMO physician mortgage page. Public page describes program terms and discounts; exact live rates may not be published.",
  },
  "northwest-bank-physician": {
    sourceUrl: "https://www.northwest.bank/personal/home-lending/",
    scrapeMethod: "fetch_html",
    sourceKind: "doctor_program",
    expectedLoanProduct: "Physician",
    notes: "Official Northwest home lending page with physician program details and rate information section.",
  },
  "old-national-medical": {
    sourceUrl: "https://www.oldnational.com/personal/home-loans/mortgage-for-professionals/",
    scrapeMethod: "fetch_html",
    sourceKind: "professional_program",
    expectedLoanProduct: "Professional Mortgage",
    notes: "Official Old National professional mortgage page. Exact live rates may not be published.",
  },
  "arvest-physician": {
    sourceUrl: "https://www.arvest.com/personal/borrow/home-loans/mortgage-programs/other-programs",
    scrapeMethod: "fetch_html",
    sourceKind: "doctor_program",
    expectedLoanProduct: "Physician Loan",
    notes: "Official Arvest non-conforming mortgage programs page with physician loan details. Exact live rates may not be published.",
  },
};

export const DEFAULT_RATE_SOURCES: RateSourceSeed[] = LENDER_PROGRAMS.map((program) => ({
  programSlug: program.id,
  lenderName: program.lenderName,
  programName: program.programName,
  programType: program.programType,
  sourceUrl: PUBLIC_SOURCE_OVERRIDES[program.id]?.sourceUrl ?? program.lenderWebsiteUrl ?? "https://example.com",
  scrapeMethod: PUBLIC_SOURCE_OVERRIDES[program.id]?.scrapeMethod ?? "fetch_html",
  selectorHints: {
    includeKeywords: buildKeywords(program.lenderName, program.programName),
    expectedLoanProduct: PUBLIC_SOURCE_OVERRIDES[program.id]?.expectedLoanProduct ?? program.programName,
    sourceKind: PUBLIC_SOURCE_OVERRIDES[program.id]?.sourceKind ?? "program_details",
  },
  notes: PUBLIC_SOURCE_OVERRIDES[program.id]?.notes ?? "Initial public source seed. Replace sourceUrl with the lender's exact public professional/doctor mortgage rate page when available.",
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
