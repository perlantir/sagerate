import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDegreeLabel, getLoanProgramTypeLabel, summarizeDegrees } from "@/lib/constants/professions";
import type { LenderProgram } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils/formatting";

export function ProgramRow({ program, onQualify }: { program: LenderProgram; onQualify: (program: LenderProgram) => void }) {
  return (
    <tr className="border-t border-slate-100 align-top transition hover:bg-slate-50">
      <td className="min-w-48 px-4 py-4">
        <div className="font-bold text-navy">{program.lenderName}</div>
      </td>
      <td className="min-w-40 px-4 py-4">
        <Badge className="border-gold/25 bg-gold/10 text-navy">{getLoanProgramTypeLabel(program.programType)}</Badge>
      </td>
      <td className="min-w-44 px-4 py-4 text-sm font-bold text-navy">{program.programName}</td>
      <td className="min-w-52 px-4 py-4" title={program.acceptedDegrees.map((degree) => getDegreeLabel(degree)).join(", ")}>
        <div className="flex flex-wrap gap-1">
          {program.acceptedDegrees.slice(0, 4).map((degree) => (
            <Badge key={degree}>{getDegreeLabel(degree)}</Badge>
          ))}
          {program.acceptedDegrees.length > 4 ? <Badge>+{program.acceptedDegrees.length - 4}</Badge> : null}
        </div>
      </td>
      <td className="px-4 py-4">
        <Badge className="bg-white">{program.maxLoanAmountZeroDown ? "0%" : "Low down"}</Badge>
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-slate-800">{formatCurrency(program.maxLoanAmountZeroDown)}</td>
      <td className="px-4 py-4">
        <Badge className={program.pmiRequired ? "border-amber-200 bg-amber-50 text-amber-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}>
          {program.pmiRequired ? "Required" : "None"}
        </Badge>
      </td>
      <td className="px-4 py-4 text-sm text-slate-700">{studentDebtLabel(program.studentLoanTreatment)}</td>
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1">
          {program.rateTypesAvailable.slice(0, 2).map((rate) => (
            <Badge key={rate} className="bg-white">
              {rate}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-4 py-4 text-sm font-semibold text-slate-800">{program.fixedRateEstimate ? formatPercent(program.fixedRateEstimate + 0.18) : "After answers"}</td>
      <td className="max-w-36 px-4 py-4 text-xs text-slate-600" title={program.licensedStates.join(", ")}>
        {program.licensedStates.length > 20 ? "Nationwide" : program.licensedStates.join(", ")}
      </td>
      <td className="min-w-32 px-4 py-4">
        <Button type="button" variant="outline" size="sm" className="whitespace-nowrap border-gold text-gold hover:bg-gold/10" onClick={() => onQualify(program)}>
          View Details
        </Button>
      </td>
    </tr>
  );
}

export function ProgramMobileCard({ program, onQualify }: { program: LenderProgram; onQualify: (program: LenderProgram) => void }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-navy">{program.lenderName}</h3>
          <p className="text-sm text-slate-500">{program.programName}</p>
        </div>
        <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">{program.pmiRequired ? "PMI" : "No PMI"}</Badge>
      </div>
      <div className="mt-4 grid gap-3 text-sm">
        <Info label="Loan Type" value={getLoanProgramTypeLabel(program.programType)} />
        <Info label="Eligible" value={summarizeDegrees(program.acceptedDegrees, 3)} />
        <Info label="Max 0% Down" value={formatCurrency(program.maxLoanAmountZeroDown)} />
        <Info label="Max Total" value={formatCurrency(program.maxLoanAmountTotal)} />
        <Info label="Residents" value={program.acceptsResidents ? "Accepted" : "Not accepted"} />
        <Info label="Student Debt" value={studentDebtLabel(program.studentLoanTreatment)} />
      </div>
      <Button type="button" variant="gold" className="mt-4 w-full" onClick={() => onQualify(program)}>
        View Rate Details
      </Button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-bold text-slate-800">{value}</span>
    </div>
  );
}

function studentDebtLabel(value: LenderProgram["studentLoanTreatment"]) {
  if (value === "excluded") return "Excluded";
  if (value === "ibr_payment") return "IBR Used";
  if (value === "full_payment") return "Full Payment";
  return "Varies";
}
