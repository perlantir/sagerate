import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROFESSIONS } from "@/lib/constants/professions";
import { ProfessionIcon } from "@/components/shared/ProfessionIcon";

export function ProfessionCards() {
  return (
    <section className="bg-white py-16">
      <div className="container-page">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-navy">Start with your professional path</h2>
          <p className="mt-3 text-slate-600">Each program in the marketplace is mapped to eligible degrees, training windows, and state availability.</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROFESSIONS.map((profession) => (
            <Link
              key={profession.slug}
              href={`/professions/${profession.slug}`}
              className="gold-focus group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-navy text-white">
                  <ProfessionIcon icon={profession.icon} />
                </span>
                <ArrowRight className="text-slate-300 transition group-hover:text-gold" size={18} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy">{profession.title}</h3>
              <p className="mt-1 text-sm font-semibold text-gold">{profession.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
