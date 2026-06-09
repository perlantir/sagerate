import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ProgramTable } from "@/components/compare/ProgramTable";
import { PROFESSION_FAQS } from "@/lib/constants/content";
import { type getProfessionBySlug } from "@/lib/constants/professions";
import type { LenderProgram } from "@/lib/types";

type Profession = NonNullable<ReturnType<typeof getProfessionBySlug>>;

export function ProfessionLanding({ profession, programs }: { profession: Profession; programs: LenderProgram[] }) {
  const faqs = PROFESSION_FAQS[profession.slug] ?? PROFESSION_FAQS.other;
  return (
    <main>
      <section className="bg-navy text-white">
        <div className="container-page grid gap-8 py-16 md:grid-cols-[1fr_.7fr] md:items-center">
          <div>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">{profession.hero}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">{profession.subheadline}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={`/compare?degree=${profession.degree}`} variant="gold">
                Compare Options
                <ArrowRight size={16} />
              </LinkButton>
              <LinkButton href={`/get-rates?profession=${profession.degree}`} variant="outline" className="border-white/35 bg-transparent text-white hover:bg-white/10">
                Get My Rate Options
              </LinkButton>
            </div>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/10 p-5">
            {["0% down options", "No PMI structures", "Student debt flexibility"].map((item) => (
              <div key={item} className="flex items-center gap-3 border-b border-white/10 py-4 last:border-0">
                <CheckCircle2 className="text-gold" size={20} />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-white py-14">
        <div className="container-page">
          <h2 className="text-3xl font-bold text-navy">Key benefits for {profession.title.toLowerCase()}</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ["Low down payment", "Compare 0%, 5%, and 10% down tiers by lender."],
              ["No PMI focus", "Quickly identify programs where PMI is not required."],
              ["Credential fit", "Filter by degree, career stage, and state availability."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <Badge className="mb-4 border-gold/30 bg-gold/10 text-navy">{profession.label}</Badge>
                <h3 className="text-lg font-bold text-navy">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface py-14">
        <div className="container-page">
          <h2 className="mb-6 text-3xl font-bold text-navy">Programs accepting {profession.label}</h2>
          <ProgramTable programs={programs} initialFilters={{ degree: profession.degree }} />
        </div>
      </section>
      <section className="bg-white py-14">
        <div className="container-page grid gap-4 md:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <div key={question} className="rounded-lg border border-slate-200 p-5">
              <h3 className="font-bold text-navy">{question}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{answer}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
