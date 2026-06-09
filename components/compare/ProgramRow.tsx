import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDegreeLabel, getLoanProgramTypeLabel, summarizeDegrees } from "@/lib/constants/professions";
import type { LenderProgram } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatting";
import { estimateProgramRate, formatRate, type RateEstimateContext } from "@/lib/utils/rateEstimates";

export function ProgramRow({
  program,
  estimateContext,
  onQualify,
}: {
  program: LenderProgram;
  estimateContext: RateEstimateContext;
  onQualify: (program: LenderProgram) => void;
}) {
  const estimate = estimateProgramRate(program, estimateContext);
  return (
    <tr className="border-t border-slate-200 align-top transition hover:bg-slate-50">
      <td className="px-4 py-5">
        <div className="max-w-72">
          <div className="text-2xl font-black tracking-tight text-navy">{program.lenderName}</div>
          <div className="mt-1 text-xs font-semibold text-slate-500">{program.programName}</div>
          <div className="mt-3 text-xs font-semibold text-slate-600">
            {program.licensedStates.length > 20 ? "Nationwide availability" : `${program.licensedStates.length} eligible states`} · {program.acceptsResidents ? "Residents accepted" : "Practicing professionals"}
          </div>
          <div className="mt-3 flex flex-wrap gap-1">
            <Badge className="border-gold/30 bg-gold/10 text-navy">{getLoanProgramTypeLabel(program.programType)}</Badge>
            <Badge className="bg-white" title={program.acceptedDegrees.map((degree) => getDegreeLabel(degree)).join(", ")}>
              {summarizeDegrees(program.acceptedDegrees, 2)}
            </Badge>
            <Badge className="bg-white">{program.pmiRequired ? "PMI required" : "No PMI"}</Badge>
          </div>
        </div>
      </td>
      <td className="px-4 py-5">
        <div className="text-3xl font-black tracking-tight text-navy">{formatRate(estimate.interestRate)}</div>
        <div className="mt-3 text-xs font-semibold text-slate-600">{estimate.termLabel}</div>
      </td>
      <td className="px-4 py-5">
        <div className="text-3xl font-black tracking-tight text-navy">{formatRate(estimate.apr)}</div>
        <button type="button" className="mt-3 text-xs font-semibold text-gold underline decoration-dotted underline-offset-4">
          Points: {estimate.points.toFixed(3)}
        </button>
      </td>
      <td className="px-4 py-5">
        <div className="text-2xl font-black tracking-tight text-navy">{formatCurrency(estimate.monthlyPayment)}</div>
        <button type="button" className="mt-3 block text-xs font-semibold text-gold underline decoration-dotted underline-offset-4">
          Upfront costs: {formatCurrency(estimate.upfrontCosts)}
        </button>
        <button type="button" className="mt-2 block text-xs font-semibold text-gold underline decoration-dotted underline-offset-4">
          8 year cost: {formatCurrency(estimate.eightYearCost)}
        </button>
      </td>
      <td className="px-4 py-5">
        <div className="text-sm font-black text-navy">{formatCurrency(estimate.upfrontCosts)}</div>
        <div className="mt-2 text-xs leading-5 text-slate-600">
          Lender fees: {formatCurrency(estimate.lenderFees)}
          <br />
          Third-party: {formatCurrency(estimate.thirdPartyFees)}
        </div>
      </td>
      <td className="px-4 py-5 text-right">
        <Button type="button" className="min-w-28" onClick={() => onQualify(program)}>
          Next
          <ArrowRight size={16} />
        </Button>
        <button type="button" onClick={() => onQualify(program)} className="mt-3 block w-full text-right text-xs font-bold text-gold">
          More information
        </button>
      </td>
    </tr>
  );
}

export function ProgramMobileCard({
  program,
  estimateContext,
  onQualify,
}: {
  program: LenderProgram;
  estimateContext: RateEstimateContext;
  onQualify: (program: LenderProgram) => void;
}) {
  const estimate = estimateProgramRate(program, estimateContext);
  return (
    <div data-testid="rate-card" className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-navy">{program.lenderName}</h3>
          <p className="text-sm text-slate-500">{program.programName}</p>
        </div>
        <Badge className="border-gold/30 bg-gold/10 text-navy">{getLoanProgramTypeLabel(program.programType)}</Badge>
      </div>
      <div className="mt-4 grid gap-3 text-sm">
        <Info label="Interest rate" value={formatRate(estimate.interestRate)} strong />
        <Info label="APR" value={formatRate(estimate.apr)} strong />
        <Info label="Mo. payment" value={formatCurrency(estimate.monthlyPayment)} strong />
        <Info label="Closing fees" value={formatCurrency(estimate.upfrontCosts)} />
        <Info label="Points" value={estimate.points.toFixed(3)} />
        <Info label="Eligible" value={summarizeDegrees(program.acceptedDegrees, 3)} />
      </div>
      <Button type="button" className="mt-4 w-full" onClick={() => onQualify(program)}>
        Next
        <ArrowRight size={16} />
      </Button>
    </div>
  );
}

function Info({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className={`text-right font-bold ${strong ? "text-lg text-navy" : "text-slate-800"}`}>{value}</span>
    </div>
  );
}
