import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProgramTable } from "@/components/compare/ProgramTable";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { LinkButton } from "@/components/ui/button";
import { PROFESSIONS } from "@/lib/constants/professions";
import { getStateBySlug, STATES } from "@/lib/constants/states";
import { listPrograms } from "@/lib/services/programs";

export function generateStaticParams() {
  return STATES.map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) return {};
  return {
    title: `Professional Mortgage Loans in ${state.name}`,
    description: `Compare physician, dentist, attorney, CPA, and professional mortgage loan programs available in ${state.name}.`,
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: slug } = await params;
  const state = getStateBySlug(slug);
  if (!state) notFound();
  const programs = await listPrograms({ state: state.code });

  return (
    <>
      <Header />
      <main>
        <section className="bg-navy text-white">
          <div className="container-page py-14">
            <h1 className="font-serif text-4xl font-bold">Professional Mortgage Loans in {state.name}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/78">
              Compare professional lender programs available in {state.name}, including medical, dental, legal, and finance credential paths.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton href={`/compare?state=${state.code}`} variant="gold">
                Compare {state.code} Programs
              </LinkButton>
              <LinkButton href={`/get-rates?state=${state.code}`} variant="outline" className="border-white/35 bg-transparent text-white hover:bg-white/10">
                Get Rate Options
              </LinkButton>
            </div>
          </div>
        </section>
        <section className="bg-white py-12">
          <div className="container-page grid gap-4 md:grid-cols-3">
            {PROFESSIONS.slice(0, 6).map((profession) => (
              <div key={profession.slug} className="rounded-lg border border-slate-200 p-5">
                <h2 className="font-bold text-navy">Programs for {profession.title} in {state.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Filter by {profession.label}, loan amount, career stage, and student debt treatment.
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="bg-surface py-12">
          <div className="container-page">
            <ProgramTable programs={programs} initialFilters={{ state: state.code }} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
