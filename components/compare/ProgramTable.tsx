"use client";

import { useMemo, useState } from "react";
import { ProgramFilters } from "@/components/compare/ProgramFilters";
import { ProgramMobileCard, ProgramRow } from "@/components/compare/ProgramRow";
import { QuickCaptureModal } from "@/components/compare/QuickCaptureModal";
import { TableEmptyState } from "@/components/compare/TableEmptyState";
import type { LenderProgram } from "@/lib/types";
import { filterPrograms } from "@/lib/services/programs";

export type ProgramFiltersState = {
  programType: string;
  degree: string;
  careerStage: string;
  state: string;
  loanAmount: string;
  loanPurpose: string;
  downPayment: string;
};

const defaultFilters: ProgramFiltersState = {
  programType: "all",
  degree: "all",
  careerStage: "all",
  state: "all",
  loanAmount: "",
  loanPurpose: "purchase",
  downPayment: "all",
};

export function ProgramTable({ programs, initialFilters = {} }: { programs: LenderProgram[]; initialFilters?: Partial<ProgramFiltersState> }) {
  const [filters, setFilters] = useState<ProgramFiltersState>({ ...defaultFilters, ...initialFilters });
  const [sortKey, setSortKey] = useState<"lenderName" | "maxLoanAmountZeroDown" | "maxLoanAmountTotal">("lenderName");
  const [activeProgram, setActiveProgram] = useState<LenderProgram | null>(null);

  const filtered = useMemo(() => {
    const result = filterPrograms(programs, {
      ...filters,
      loanAmount: filters.loanAmount ? Number(filters.loanAmount) : null,
    }).sort((a, b) => {
      if (sortKey === "lenderName") return a.lenderName.localeCompare(b.lenderName);
      return (b[sortKey] ?? 0) - (a[sortKey] ?? 0);
    });
    return result;
  }, [filters, programs, sortKey]);

  return (
    <div className="grid gap-5">
      <ProgramFilters filters={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
      <div className="text-sm font-semibold text-slate-600">{filtered.length} matching lender programs</div>
      {filtered.length === 0 ? <TableEmptyState /> : null}
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:block">
        <div className="table-scroll overflow-x-auto">
          <table className="w-full min-w-[1360px] border-collapse text-left">
            <thead className="bg-navy text-xs uppercase tracking-[0.08em] text-white">
              <tr>
                <SortableHeader label="Lender" onClick={() => setSortKey("lenderName")} />
                <th className="px-4 py-3">Loan Type</th>
                <th className="px-4 py-3">Program Name</th>
                <th className="px-4 py-3">Best For</th>
                <th className="px-4 py-3">Down Payment</th>
                <SortableHeader label="Max Loan (0% Down)" onClick={() => setSortKey("maxLoanAmountZeroDown")} />
                <th className="px-4 py-3">PMI</th>
                <th className="px-4 py-3">Student Debt Considered</th>
                <th className="px-4 py-3">Rate Option</th>
                <SortableHeader label="APR" onClick={() => setSortKey("maxLoanAmountTotal")} />
                <th className="px-4 py-3">States</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((program) => (
                <ProgramRow key={program.id} program={program} onQualify={setActiveProgram} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid gap-4 lg:hidden">
        {filtered.map((program) => (
          <ProgramMobileCard key={program.id} program={program} onQualify={setActiveProgram} />
        ))}
      </div>
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
