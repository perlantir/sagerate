"use client";

import { useMemo, useState } from "react";
import { ProgramFilters } from "@/components/compare/ProgramFilters";
import { ProgramMobileCard, ProgramRow } from "@/components/compare/ProgramRow";
import { QuickCaptureModal } from "@/components/compare/QuickCaptureModal";
import { TableEmptyState } from "@/components/compare/TableEmptyState";
import type { LenderProgram } from "@/lib/types";
import { filterPrograms } from "@/lib/services/programs";
import { estimateProgramRate, getEstimatedLoanAmount, type RateEstimateContext } from "@/lib/utils/rateEstimates";
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
  loanTerm: string;
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
  loanTerm: "30yr",
  downPayment: "20",
};

type SortKey = "relevance" | "rate" | "apr" | "payment" | "fees";

export function ProgramTable({ programs, initialFilters = {} }: { programs: LenderProgram[]; initialFilters?: Partial<ProgramFiltersState> }) {
  const [filters, setFilters] = useState<ProgramFiltersState>({ ...defaultFilters, ...initialFilters });
  const [sortKey, setSortKey] = useState<SortKey>("relevance");
  const [activeProgram, setActiveProgram] = useState<LenderProgram | null>(null);
  const estimateContext: RateEstimateContext = useMemo(
    () => ({
      purchasePrice: filters.purchasePrice,
      downPaymentAmount: filters.downPaymentAmount,
      loanPurpose: filters.loanPurpose,
      loanTerm: filters.loanTerm,
      creditScore: filters.creditScore,
    }),
    [filters.creditScore, filters.downPaymentAmount, filters.loanPurpose, filters.loanTerm, filters.purchasePrice],
  );

  const filtered = useMemo(() => {
    const loanAmount = getEstimatedLoanAmount(estimateContext);
    const result = filterPrograms(programs, {
      ...filters,
      loanAmount,
    }).sort((a, b) => {
      const aEstimate = estimateProgramRate(a, estimateContext);
      const bEstimate = estimateProgramRate(b, estimateContext);
      if (sortKey === "rate") return aEstimate.interestRate - bEstimate.interestRate;
      if (sortKey === "apr") return aEstimate.apr - bEstimate.apr;
      if (sortKey === "payment") return aEstimate.monthlyPayment - bEstimate.monthlyPayment;
      if (sortKey === "fees") return aEstimate.upfrontCosts - bEstimate.upfrontCosts;
      return a.displayOrder - b.displayOrder || a.lenderName.localeCompare(b.lenderName);
    });
    return result;
  }, [estimateContext, filters, programs, sortKey]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
      <ProgramFilters filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
      <section className="min-w-0">
        <div className="mb-5 grid gap-4 md:grid-cols-[1fr_180px] md:items-start">
          <div className="text-sm leading-6 text-slate-700">
            <p>
              <span className="font-bold text-navy">Showing results for:</span>{" "}
              {filters.loanPurpose === "purchase" ? "Purchase" : "Refinance"} rate options in {filters.zipCode || "your area"} with a{" "}
              {formatCurrency(getEstimatedLoanAmount(estimateContext))} estimated loan amount.
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

        <div className="mb-3 text-sm font-semibold text-slate-600">{filtered.length} matching lender programs</div>
        {filtered.length === 0 ? <TableEmptyState /> : null}

        <div className="hidden overflow-hidden border-y border-slate-200 bg-white lg:block">
          <div className="table-scroll overflow-x-auto">
            <table data-testid="rate-table" className="w-full min-w-[980px] border-collapse text-left">
              <thead className="border-b border-slate-300 bg-white text-xs font-bold text-slate-600">
                <tr>
                  <th className="w-[28%] px-4 py-3">Lender</th>
                  <SortableHeader label="Interest rate" onClick={() => setSortKey("rate")} />
                  <SortableHeader label="APR" onClick={() => setSortKey("apr")} />
                  <SortableHeader label="Mo. payment" onClick={() => setSortKey("payment")} />
                  <SortableHeader label="Closing fees" onClick={() => setSortKey("fees")} />
                  <th className="px-4 py-3 text-right">as of Jun 9, 2026</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((program) => (
                  <ProgramRow key={program.id} program={program} estimateContext={estimateContext} onQualify={setActiveProgram} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-4 lg:hidden">
          {filtered.map((program) => (
            <ProgramMobileCard key={program.id} program={program} estimateContext={estimateContext} onQualify={setActiveProgram} />
          ))}
        </div>
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

function SortableHeader({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <th className="px-4 py-3">
      <button type="button" onClick={onClick} className="gold-focus rounded text-left hover:text-gold">
        {label}
      </button>
    </th>
  );
}
