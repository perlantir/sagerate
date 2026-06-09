import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LENDER_PROGRAMS } from "@/lib/constants/programs";
import { formatCurrency } from "@/lib/utils/formatting";

export function FeaturedPrograms() {
  const programs = LENDER_PROGRAMS.slice(0, 4);
  return (
    <section className="bg-white pb-16">
      <div className="container-page">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-navy">Featured lender programs</h2>
            <p className="mt-2 text-slate-600">A preview of programs maintained through the admin dashboard.</p>
          </div>
          <LinkButton href="/compare" variant="outline">
            See All Programs
            <ArrowRight size={16} />
          </LinkButton>
        </div>
        <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="hidden grid-cols-[1.2fr_1fr_1fr_.8fr] bg-navy px-5 py-3 text-sm font-bold text-white md:grid">
            <span>Lender</span>
            <span>Eligible Degrees</span>
            <span>Max 0% Down</span>
            <span>PMI</span>
          </div>
          {programs.map((program) => (
            <div key={program.id} className="grid gap-3 border-t border-slate-100 px-5 py-4 text-sm md:grid-cols-[1.2fr_1fr_1fr_.8fr] md:items-center">
              <div>
                <div className="font-bold text-navy">{program.lenderName}</div>
                <div className="text-slate-500">{program.programName}</div>
              </div>
              <div className="flex flex-wrap gap-1">
                {program.acceptedDegrees.slice(0, 4).map((degree) => (
                  <Badge key={degree}>{degree.toUpperCase()}</Badge>
                ))}
              </div>
              <div className="font-semibold text-slate-700">{formatCurrency(program.maxLoanAmountZeroDown)}</div>
              <Badge className="w-fit border-emerald-200 bg-emerald-50 text-emerald-700">{program.pmiRequired ? "Required" : "None"}</Badge>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
