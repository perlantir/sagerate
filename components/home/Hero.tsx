import { ArrowRight, Calculator, HomeIcon, Search } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { PROFESSIONS } from "@/lib/constants/professions";
import { ProfessionIcon } from "@/components/shared/ProfessionIcon";

export function Hero() {
  return (
    <section className="bg-white px-4 py-4">
      <div className="mx-auto max-w-[1430px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="relative min-h-[540px] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,43,70,0.03)_0_1px,transparent_1px_180px)]" />
          <div className="absolute right-0 bottom-0 h-[360px] w-[440px] bg-navy [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
          <div className="absolute right-[88px] top-[88px] h-[320px] w-[320px] rotate-45 border border-gold/30" />
          <div className="absolute right-[128px] top-[128px] h-[250px] w-[250px] rotate-45 border border-slate-200" />
          <div className="relative z-10 px-8 py-16 sm:px-16 lg:px-24">
            <h1 className="max-w-2xl font-serif text-5xl font-bold leading-[1.07] text-navy sm:text-6xl lg:text-7xl">
              The Mortgage Marketplace Built for Professionals
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
              Compare specialized loan programs for physicians, dentists, attorneys, and more. 0% down. No PMI. Student debt flexibility.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <LinkButton href="/compare" variant="gold" size="lg" className="min-w-[236px]">
                <Search size={18} />
                Compare Current Rates
                <ArrowRight size={18} />
              </LinkButton>
              <LinkButton href="/get-rates" variant="outline" size="lg" className="min-w-[236px] border-gold text-gold hover:bg-gold/10">
                <Calculator size={18} />
                Get My Rate Options
              </LinkButton>
            </div>
          </div>
        </div>
        <div className="grid border-t border-slate-200 bg-white sm:grid-cols-3 lg:grid-cols-6">
          {PROFESSIONS.map((profession) => (
            <a
              key={profession.slug}
              href={`/professions/${profession.slug}`}
              className="gold-focus flex min-h-24 flex-col items-center justify-center gap-2 border-b border-r border-slate-200 px-4 text-center text-navy transition hover:bg-slate-50 lg:border-b-0"
            >
              <span className="text-navy">{profession.icon === "briefcase" ? <HomeIcon size={26} /> : <ProfessionIcon icon={profession.icon} size={27} />}</span>
              <span className="text-sm font-semibold">{profession.title.replace(" & Surgeons", "").replace(" & Finance", "")}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
