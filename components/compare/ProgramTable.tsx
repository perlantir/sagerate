"use client";

import { useMemo, useState } from "react";
import { ProgramFilters } from "@/components/compare/ProgramFilters";
import { ProgramMobileCard, ProgramRow } from "@/components/compare/ProgramRow";
import { QuickCaptureModal } from "@/components/compare/QuickCaptureModal";
import { TableEmptyState } from "@/components/compare/TableEmptyState";
import type { ComparableRateSnapshot, LenderProgram } from "@/lib/types";
import { filterPrograms } from "@/lib/services/programs";
import { getEstimatedLoanAmount, resolveProgramRateQuote, type RateEstimateContext } from "@/lib/utils/rateEstimates";
import { formatCurrency } from "@/lib/utils/formatting";

export type ProgramFiltersState = {
  programType: string;
  degree: string;
  careerStage: string;
  state: string;
  zipCode: string;
  purchasePrice: string;
  downPaymentAmount: string;
  creditScore: string;
  loanPurpose: string;
  loanTerms: string[];
  downPayment: string;
};

const defaultFilters: ProgramFiltersState = {
  programType: "all",
  degree: "all",
  careerStage: "all",
  state: "all",
  zipCode: "50321",
  purchasePrice: "400000",
  downPaymentAmount: "80000",
  creditScore: "780",
  loanPurpose: "purchase",
  loanTerms: ["30yr"],
  downPayment: "20",
};

type SortKey = "relevance" | "rate" | "apr" | "payment" | "fees";
const loanTermLabels: Record<string, string> = {
  "30yr": "30 yr fixed",
  "20yr": "20 yr fixed",
  "15yr": "15 yr fixed",
  "5-1arm": "5 yr ARM",
  "7-1arm": "7 yr ARM",
  "10-1arm": "10 yr ARM",
};

export function ProgramTable({
  programs,
  rateSnapshotsByProgram = {},
  initialFilters = {},
}: {
  programs: LenderProgram[];
  rateSnapshotsByProgram?: Record<string, ComparableRateSnapshot[]>;
  initialFilters?: Partial<ProgramFiltersState>;
}) {
  const [filters, setFilters] = useState<ProgramFiltersState>({ ...defaultFilters, ...initialFilters });
  const [sortKey, setSortKey] = useState<SortKey>("relevance");
  const [activeProgram, setActiveProgram] = useState<LenderProgram | null>(null);
  const estimateContext: RateEstimateContext = useMemo(
    () => ({
      purchasePrice: filters.purchasePrice,
      downPaymentAmount: filters.downPaymentAmount,
      loanPurpose: filters.loanPurpose,
      loanTerm: filters.loanTerms[0] ?? "30yr",
      creditScore: filters.creditScore,
    }),
    [filters.creditScore, filters.downPaymentAmount, filters.loanPurpose, filters.loanTerms, filters.purchasePrice],
  );

  const filtered = useMemo(() => {
    const loanAmount = getEstimatedLoanAmount(estimateContext);
    const programsWithComparableRates = programs.filter((program) => Boolean(rateSnapshotsByProgram[program.id]?.length));
    const matchedPrograms = filterPrograms(programsWithComparableRates, {
      ...filters,
      loanAmount,
    });
    const result = matchedPrograms
      .flatMap((program) =>
        (rateSnapshotsByProgram[program.id] ?? [])
          .filter((snapshot) => matchesSelectedTerms(snapshot, filters.loanTerms))
          .map((snapshot) => ({ program, snapshot })),
      )
      .sort((a, b) => {
        const aQuote = resolveProgramRateQuote(a.program, getContextForSnapshot(estimateContext, a.snapshot, filters.loanTerms), a.snapshot);
        const bQuote = resolveProgramRateQuote(b.program, getContextForSnapshot(estimateContext, b.snapshot, filters.loanTerms), b.snapshot);
        if (sortKey === "rate") return aQuote.interestRate - bQuote.interestRate;
        if (sortKey === "apr") return aQuote.apr - bQuote.apr;
        if (sortKey === "payment") return aQuote.monthlyPayment - bQuote.monthlyPayment;
        if (sortKey === "fees") return aQuote.upfrontCosts - bQuote.upfrontCosts;
        return a.program.displayOrder - b.program.displayOrder || a.program.lenderName.localeCompare(b.program.lenderName);
      });
    return result;
  }, [estimateContext, filters, programs, rateSnapshotsByProgram, sortKey]);

  const comparableRateCount = Object.values(rateSnapshotsByProgram).reduce((total, snapshots) => total + snapshots.length, 0);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
      <ProgramFilters filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
      <section className="min-w-0">
        <div className="mb-5 grid gap-4 md:grid-cols-[1fr_180px] md:items-start">
          <div className="text-sm leading-6 text-slate-700">
            <p>
              <span className="font-bold text-navy">Showing results for:</span>{" "}
              {filters.loanPurpose === "purchase" ? "Purchase" : "Refinance"} rate options in {filters.zipCode || "your area"} with a{" "}
              {formatCurrency(getEstimatedLoanAmount(estimateContext))} estimated loan amount and {formatSelectedLoanTerms(filters.loanTerms)}.
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Showing only lenders with scraped professional or physician/doctor program rates. {comparableRateCount} lender source{comparableRateCount === 1 ? "" : "s"} available.
            </p>
            <button type="button" className="mt-1 text-xs font-bold text-gold">
              Key terms explained
            </button>
          </div>
          <label className="grid gap-2 text-xs font-bold text-navy">
            Sort by
            <select
              data-testid="sort-by"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as SortKey)}
              className="h-11 rounded-sm border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="relevance">Relevance</option>
              <option value="rate">Interest rate</option>
              <option value="apr">APR</option>
              <option value="payment">Monthly payment</option>
              <option value="fees">Closing fees</option>
            </select>
          </label>
        </div>

        <div className="mb-3 text-sm font-semibold text-slate-600">{filtered.length} matching rate option{filtered.length === 1 ? "" : "s"}</div>
        {filtered.length === 0 ? <TableEmptyState reason={comparableRateCount === 0 ? "rates" : "filters"} /> : null}

        {filtered.length > 0 ? <div className="hidden overflow-hidden border-y border-slate-200 bg-white lg:block">
          <div className="table-scroll overflow-x-auto">
            <table data-testid="rate-table" className="w-full min-w-[980px] border-collapse text-left">
              <thead className="border-b border-slate-300 bg-white text-xs font-bold text-slate-600">
                <tr>
                  <th className="w-[28%] px-4 py-3">Lender</th>
                  <SortableHeader label="Interest rate" onClick={() => setSortKey("rate")} />
                  <SortableHeader label="APR" onClick={() => setSortKey("apr")} />
                  <SortableHeader label="Mo. payment" onClick={() => setSortKey("payment")} />
                  <SortableHeader label="Closing fees" onClick={() => setSortKey("fees")} />
                  <th className="px-4 py-3 text-right">Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ program, snapshot }) => (
                  <ProgramRow
                    key={`${program.id}-${snapshot.id}`}
                    program={program}
                    estimateContext={getContextForSnapshot(estimateContext, snapshot, filters.loanTerms)}
                    rateSnapshot={snapshot}
                    onQualify={setActiveProgram}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div> : null}

        {filtered.length > 0 ? <div className="grid gap-4 lg:hidden">
          {filtered.map(({ program, snapshot }) => (
            <ProgramMobileCard
              key={`${program.id}-${snapshot.id}`}
              program={program}
              estimateContext={getContextForSnapshot(estimateContext, snapshot, filters.loanTerms)}
              rateSnapshot={snapshot}
              onQualify={setActiveProgram}
            />
          ))}
        </div> : null}
      </section>

      <QuickCaptureModal
        program={activeProgram}
        defaultDegree={filters.degree}
        defaultCareerStage={filters.careerStage}
        onClose={() => setActiveProgram(null)}
      />
    </div>
  );
}

function getContextForSnapshot(context: RateEstimateContext, snapshot: ComparableRateSnapshot, selectedTerms: string[]): RateEstimateContext {
  return {
    ...context,
    loanTerm: getTermValueFromLoanProduct(snapshot.loanProduct) ?? selectedTerms[0] ?? context.loanTerm,
  };
}

function matchesSelectedTerms(snapshot: ComparableRateSnapshot, selectedTerms: string[]) {
  const term = getTermValueFromLoanProduct(snapshot.loanProduct);
  if (!term) return true;
  return selectedTerms.includes(term);
}

function getTermValueFromLoanProduct(loanProduct?: string | null) {
  const normalized = loanProduct?.toLowerCase() ?? "";
  if (matchesArmTerm(normalized, 10)) return "10-1arm";
  if (matchesArmTerm(normalized, 7)) return "7-1arm";
  if (matchesArmTerm(normalized, 5)) return "5-1arm";
  if (matchesFixedTerm(normalized, 30)) return "30yr";
  if (matchesFixedTerm(normalized, 20)) return "20yr";
  if (matchesFixedTerm(normalized, 15)) return "15yr";
  return null;
}

function matchesArmTerm(value: string, years: number) {
  return new RegExp(`\\b${years}\\s*(?:/|-)?(?:1|6)?\\s*arm\\b`).test(value) || new RegExp(`\\b${years}\\s*(?:year|yr)\\s*arm\\b`).test(value);
}

function matchesFixedTerm(value: string, years: number) {
  return new RegExp(`\\b${years}\\s*(?:-|\\s)?(?:year|yr)\\s*(?:fixed|fixed-rate)?\\b`).test(value);
}

function formatSelectedLoanTerms(values: string[]) {
  const labels = values.map((value) => loanTermLabels[value] ?? value);
  if (labels.length <= 1) return labels[0] ?? "selected loan terms";
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function SortableHeader({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <th className="px-4 py-3">
      <button type="button" onClick={onClick} className="gold-focus rounded text-left hover:text-gold">
        {label}
      </button>
    </th>
  );
}
