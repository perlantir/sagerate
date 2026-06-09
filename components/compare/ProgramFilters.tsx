"use client";

import { RotateCcw } from "lucide-react";
import { DEGREE_OPTIONS, LOAN_PROGRAM_TYPES, getEligibleDegreeOptions } from "@/lib/constants/professions";
import { CAREER_STAGES } from "@/lib/constants/loanTypes";
import { STATES } from "@/lib/constants/states";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type { ProgramFiltersState } from "@/components/compare/ProgramTable";

const creditScores = ["780", "760", "740", "720", "700", "680", "660", "640"];
const loanTerms = [
  ["30yr", "30 yr fixed"],
  ["20yr", "20 yr fixed"],
  ["15yr", "15 yr fixed"],
  ["5-1arm", "5 yr ARM"],
] as const;

export function ProgramFilters({
  filters,
  onChange,
  onReset,
}: {
  filters: ProgramFiltersState;
  onChange: (filters: ProgramFiltersState) => void;
  onReset: () => void;
}) {
  const degreeOptions = filters.programType === "all" ? DEGREE_OPTIONS.filter((option) => option.value !== "other") : getEligibleDegreeOptions(filters.programType);

  function updateProgramType(programType: string) {
    const nextDegreeOptions = programType === "all" ? DEGREE_OPTIONS.filter((option) => option.value !== "other") : getEligibleDegreeOptions(programType);
    onChange({
      ...filters,
      programType,
      degree: filters.degree !== "all" && !nextDegreeOptions.some((option) => option.value === filters.degree) ? "all" : filters.degree,
    });
  }

  function updatePurchasePrice(value: string) {
    const purchasePrice = cleanMoney(value);
    const downPaymentPercent = Number(filters.downPayment || 0);
    onChange({
      ...filters,
      purchasePrice,
      downPaymentAmount: downPaymentPercent ? String(Math.round((Number(purchasePrice || 0) * downPaymentPercent) / 100)) : filters.downPaymentAmount,
    });
  }

  function updateDownPaymentAmount(value: string) {
    const downPaymentAmount = cleanMoney(value);
    const purchasePrice = Number(filters.purchasePrice || 0);
    onChange({
      ...filters,
      downPaymentAmount,
      downPayment: purchasePrice ? String(Math.round((Number(downPaymentAmount || 0) / purchasePrice) * 100)) : filters.downPayment,
    });
  }

  function updateDownPaymentPercent(value: string) {
    const downPayment = value.replace(/[^\d]/g, "").slice(0, 2);
    const purchasePrice = Number(filters.purchasePrice || 0);
    onChange({
      ...filters,
      downPayment,
      downPaymentAmount: purchasePrice && downPayment ? String(Math.round((purchasePrice * Number(downPayment)) / 100)) : filters.downPaymentAmount,
    });
  }

  return (
    <aside data-testid="program-filter-rail" className="min-w-0 rounded-sm border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-20">
      <div className="grid gap-5">
        <div>
          <div className="mb-2 text-xs font-bold text-navy">Mortgage type</div>
          <div className="grid grid-cols-2 rounded-sm border border-slate-300">
            {[
              ["purchase", "Purchase"],
              ["refinance", "Refinance"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ ...filters, loanPurpose: value })}
                className={`h-12 text-sm font-bold transition ${
                  filters.loanPurpose === value ? "border border-gold bg-gold/10 text-navy" : "border border-transparent text-navy hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <FilterField label="ZIP code">
          <Input inputMode="numeric" maxLength={5} value={filters.zipCode} onChange={(event) => onChange({ ...filters, zipCode: event.target.value.replace(/\D/g, "").slice(0, 5) })} />
        </FilterField>

        <FilterField label={filters.loanPurpose === "purchase" ? "Purchase price" : "Home value"}>
          <MoneyInput value={filters.purchasePrice} onChange={updatePurchasePrice} />
        </FilterField>

        <div>
          <div className="mb-2 text-xs font-bold text-navy">Down payment</div>
          <div className="grid grid-cols-[1fr_72px]">
            <MoneyInput value={filters.downPaymentAmount} onChange={updateDownPaymentAmount} className="rounded-r-none" />
            <div className="flex items-center rounded-r-sm border border-l-0 border-slate-300 bg-white">
              <input
                aria-label="Down payment percentage"
                className="h-11 w-full px-3 text-sm font-semibold outline-none"
                inputMode="numeric"
                value={filters.downPayment}
                onChange={(event) => updateDownPaymentPercent(event.target.value)}
              />
              <span className="pr-3 text-sm font-bold text-slate-500">%</span>
            </div>
          </div>
        </div>

        <FilterField label="Credit score">
          <Select value={filters.creditScore} onChange={(event) => onChange({ ...filters, creditScore: event.target.value })} aria-label="Credit score">
            {creditScores.map((score) => (
              <option key={score} value={score}>{score}+</option>
            ))}
          </Select>
        </FilterField>

        <div>
          <div className="mb-2 text-xs font-bold text-navy">Loan term</div>
          <div className="grid gap-2">
            {loanTerms.map(([value, label]) => (
              <label key={value} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={filters.loanTerm === value}
                  onChange={() => onChange({ ...filters, loanTerm: value })}
                  className="h-4 w-4 accent-gold"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <FilterField label="Loan type">
          <Select value={filters.programType} onChange={(event) => updateProgramType(event.target.value)} aria-label="Loan type">
            <option value="all">All loan types</option>
            {LOAN_PROGRAM_TYPES.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </FilterField>

        <FilterField label="Profession">
          <Select value={filters.degree} onChange={(event) => onChange({ ...filters, degree: event.target.value })} aria-label="Profession degree">
            <option value="all">All professions</option>
            {degreeOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </FilterField>

        <FilterField label="State">
          <Select value={filters.state} onChange={(event) => onChange({ ...filters, state: event.target.value })} aria-label="State">
            <option value="all">All states</option>
            {STATES.map((state) => (
              <option key={state.code} value={state.code}>{state.name}</option>
            ))}
          </Select>
        </FilterField>

        <FilterField label="Career stage">
          <Select value={filters.careerStage} onChange={(event) => onChange({ ...filters, careerStage: event.target.value })} aria-label="Career stage">
            <option value="all">All stages</option>
            {CAREER_STAGES.map((stage) => (
              <option key={stage.value} value={stage.value}>{stage.label}</option>
            ))}
          </Select>
        </FilterField>

        <Button type="button" variant="ghost" size="sm" className="w-fit text-gold hover:bg-gold/10" onClick={onReset}>
          <RotateCcw size={14} />
          Reset filters
        </Button>
      </div>
    </aside>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid min-w-0 gap-2 text-xs font-bold text-navy">
      {label}
      {children}
    </label>
  );
}

function MoneyInput({ value, onChange, className = "" }: { value: string; onChange: (value: string) => void; className?: string }) {
  return (
    <div className={`flex h-11 min-w-0 items-center rounded-sm border border-slate-300 bg-white ${className}`}>
      <span className="pl-3 text-sm font-bold text-slate-500">$</span>
      <input
        className="h-full min-w-0 flex-1 px-2 text-sm font-semibold outline-none"
        inputMode="numeric"
        value={formatMoneyInput(value)}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function cleanMoney(value: string) {
  return value.replace(/[^\d]/g, "");
}

function formatMoneyInput(value: string) {
  const number = Number(cleanMoney(value));
  return number ? new Intl.NumberFormat("en-US").format(number) : "";
}
