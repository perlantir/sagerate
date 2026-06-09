"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { DEGREE_OPTIONS } from "@/lib/constants/professions";
import { CAREER_STAGES } from "@/lib/constants/loanTypes";
import { STATES } from "@/lib/constants/states";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type { ProgramFiltersState } from "@/components/compare/ProgramTable";

export function ProgramFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: ProgramFiltersState;
  onChange: (filters: ProgramFiltersState) => void;
  onReset: () => void;
}) {
  return (
    <div className="sticky top-16 z-30 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-navy">
        <SlidersHorizontal size={16} />
        Rate search filters
      </div>
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <FilterField label="Loan Purpose">
          <Select value={filters.loanPurpose} onChange={(event) => onChange({ ...filters, loanPurpose: event.target.value })} aria-label="Loan purpose">
            <option value="purchase">Purchase</option>
            <option value="refinance">Refinance</option>
            <option value="cashout_refi">Cash-out refi</option>
          </Select>
        </FilterField>
        <FilterField label="Profession">
          <Select value={filters.degree} onChange={(event) => onChange({ ...filters, degree: event.target.value })} aria-label="Profession degree">
            <option value="all">All degrees</option>
            {DEGREE_OPTIONS.filter((option) => option.value !== "other").map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Location">
          <Select value={filters.state} onChange={(event) => onChange({ ...filters, state: event.target.value })} aria-label="State">
            <option value="all">All states</option>
            {STATES.map((state) => (
              <option key={state.code} value={state.code}>{state.name}</option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Loan Amount">
          <Input inputMode="numeric" placeholder="$600,000" value={filters.loanAmount} onChange={(event) => onChange({ ...filters, loanAmount: event.target.value.replace(/[^\d]/g, "") })} aria-label="Loan amount" />
        </FilterField>
        <FilterField label="Career Stage">
          <Select value={filters.careerStage} onChange={(event) => onChange({ ...filters, careerStage: event.target.value })} aria-label="Career stage">
            <option value="all">All stages</option>
            {CAREER_STAGES.map((stage) => (
              <option key={stage.value} value={stage.value}>{stage.label}</option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Down Payment">
          <Select value={filters.downPayment} onChange={(event) => onChange({ ...filters, downPayment: event.target.value })} aria-label="Down payment">
            <option value="all">Any down payment</option>
            <option value="0">0%</option>
            <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="20">20%+</option>
          </Select>
        </FilterField>
      </div>
      <Button type="button" variant="ghost" size="sm" className="mt-3" onClick={onReset}>
        <RotateCcw size={14} />
        Reset Filters
      </Button>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
      {label}
      {children}
    </label>
  );
}
