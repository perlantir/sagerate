import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDegreeLabel, getLoanProgramTypeLabel, summarizeDegrees } from "@/lib/constants/professions";
import type { ComparableRateSnapshot, LenderProgram } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatting";
import { formatRate, resolveProgramRateQuote, type RateEstimateContext } from "@/lib/utils/rateEstimates";

export function ProgramRow({
  program,
  estimateContext,
  rateSnapshot,
  onQualify,
}: {
  program: LenderProgram;
  estimateContext: RateEstimateContext;
  rateSnapshot?: ComparableRateSnapshot;
  onQualify: (program: LenderProgram) => void;
}) {
  const quote = resolveProgramRateQuote(program, estimateContext, rateSnapshot);
  return (
    <tr className="border-t border-slate-200 align-top transition hover:bg-slate-50">
      <td className="px-4 py-5">
        <div className="max-w-72">
          <div className="mb-3 flex min-h-14 items-center">
            <LenderLogo lenderName={program.lenderName} />
          </div>
          <div className="text-xl font-black tracking-tight text-navy">{program.lenderName}</div>
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
        <div className="text-3xl font-black tracking-tight text-navy">{formatRate(quote.interestRate)}</div>
        <div className="mt-3 text-xs font-semibold text-slate-600">{quote.termLabel}</div>
      </td>
      <td className="px-4 py-5">
        <div className="text-3xl font-black tracking-tight text-navy">{formatRate(quote.apr)}</div>
        <button type="button" className="mt-3 text-xs font-semibold text-gold underline decoration-dotted underline-offset-4">
          Points: {quote.points.toFixed(3)}
        </button>
      </td>
      <td className="px-4 py-5">
        <div className="text-2xl font-black tracking-tight text-navy">{formatCurrency(quote.monthlyPayment)}</div>
        <button type="button" className="mt-3 block text-xs font-semibold text-gold underline decoration-dotted underline-offset-4">
          Upfront costs: {formatCurrency(quote.upfrontCosts)}
        </button>
        <button type="button" className="mt-2 block text-xs font-semibold text-gold underline decoration-dotted underline-offset-4">
          8 year cost: {formatCurrency(quote.eightYearCost)}
        </button>
      </td>
      <td className="px-4 py-5">
        <div className="text-sm font-black text-navy">{formatCurrency(quote.upfrontCosts)}</div>
        <div className="mt-2 text-xs leading-5 text-slate-600">
          Lender fees: {formatCurrency(quote.lenderFees)}
          <br />
          Third-party: {formatCurrency(quote.thirdPartyFees)}
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
        <div className="mt-4 text-xs font-semibold leading-5 text-slate-500">
          {quote.source === "scraped" ? "Scraped" : "Estimated"}
          {quote.asOf ? ` ${formatAsOf(quote.asOf)}` : null}
          {quote.sourceUrl ? (
            <a className="mt-1 block text-gold" href={quote.sourceUrl} target="_blank" rel="noreferrer">
              Source page
            </a>
          ) : null}
          {quote.estimatedFields.length ? <span className="mt-1 block">Estimated: {quote.estimatedFields.join(", ")}</span> : null}
        </div>
      </td>
    </tr>
  );
}

export function ProgramMobileCard({
  program,
  estimateContext,
  rateSnapshot,
  onQualify,
}: {
  program: LenderProgram;
  estimateContext: RateEstimateContext;
  rateSnapshot?: ComparableRateSnapshot;
  onQualify: (program: LenderProgram) => void;
}) {
  const quote = resolveProgramRateQuote(program, estimateContext, rateSnapshot);
  return (
    <div data-testid="rate-card" className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <LenderLogo lenderName={program.lenderName} compact />
          <h3 className="text-xl font-black text-navy">{program.lenderName}</h3>
          <p className="text-sm text-slate-500">{program.programName}</p>
        </div>
        <Badge className="border-gold/30 bg-gold/10 text-navy">{getLoanProgramTypeLabel(program.programType)}</Badge>
      </div>
      <div className="mt-4 grid gap-3 text-sm">
        <Info label="Interest rate" value={formatRate(quote.interestRate)} strong />
        <Info label="APR" value={formatRate(quote.apr)} strong />
        <Info label="Mo. payment" value={formatCurrency(quote.monthlyPayment)} strong />
        <Info label="Closing fees" value={formatCurrency(quote.upfrontCosts)} />
        <Info label="Points" value={quote.points.toFixed(3)} />
        <Info label="Source" value={quote.asOf ? `Scraped ${formatAsOf(quote.asOf)}` : "Scraped"} />
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

function LenderLogo({ lenderName, compact = false }: { lenderName: string; compact?: boolean }) {
  const logo = getLenderLogo(lenderName);
  return (
    <div className={`relative flex ${compact ? "mb-3 h-12 w-44" : "h-14 w-48"} items-center`}>
      <span
        className={`flex h-full w-full items-center rounded-sm border border-gold/30 bg-white px-3 text-left font-black leading-tight text-navy shadow-[inset_0_0_0_1px_rgba(198,154,76,0.08)] ${
          compact ? "text-base" : "text-lg"
        }`}
      >
        {getLogoFallback(lenderName)}
      </span>
      {logo ? (
        <Image
          src={logo}
          alt={`${lenderName} logo`}
          width={compact ? 176 : 192}
          height={compact ? 48 : 56}
          className="absolute inset-0 h-full w-full object-contain object-left mix-blend-multiply"
          unoptimized
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
    </div>
  );
}

function getLenderLogo(lenderName: string) {
  const logos: Record<string, string> = {
    "Arvest Bank": "https://logo.clearbit.com/arvest.com",
    BMO: "https://logo.clearbit.com/bmo.com",
    "Citizens Bank": "https://logo.clearbit.com/citizensbank.com",
    "Fifth Third Bank": "https://logo.clearbit.com/53.com",
    "First Horizon": "https://logo.clearbit.com/firsthorizon.com",
    "Flagstar Bank": "https://logo.clearbit.com/flagstar.com",
    KeyBank: "https://logo.clearbit.com/key.com",
    "Old National Bank": "https://logo.clearbit.com/oldnational.com",
    "PNC Bank": "https://logo.clearbit.com/pnc.com",
    "TD Bank": "https://logo.clearbit.com/td.com",
    Truist: "https://logo.clearbit.com/truist.com",
  };
  return logos[lenderName] ?? null;
}

function getLogoFallback(lenderName: string) {
  return lenderName.replace(/\s+Bank$/, " Bank");
}

function formatAsOf(value: string) {
  if (/^[A-Za-z]/.test(value)) return value;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
