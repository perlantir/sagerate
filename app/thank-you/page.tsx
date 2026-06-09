import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { BLOG_POSTS } from "@/lib/constants/content";
import { getDegreeLabel, getLoanProgramTypeLabel } from "@/lib/constants/professions";
import { getLead } from "@/lib/services/leads";
import { formatCurrency } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "You're Matched",
  description: "Your professional mortgage match request has been submitted.",
};

export default async function ThankYouPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const leadId = typeof params.leadId === "string" ? params.leadId : undefined;
  const lead = leadId ? await getLead(leadId) : null;
  const matched = lead?.matchedProgramCount ?? 0;

  return (
    <>
      <Header />
      <main className="bg-surface py-16">
        <div className="container-page max-w-3xl">
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="font-serif text-4xl font-bold text-navy">You&apos;re Matched!</h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              {lead
                ? `Based on your ${getDegreeLabel(lead.professionDegree)} profile in ${lead.propertyState ?? "your state"}, you matched with ${matched} ${getLoanProgramTypeLabel(lead.loanProgramType).toLowerCase()} rate options. You'll hear from matched lenders within 24 hours.`
                : "Your rate request has been received. You'll hear from matched lenders within 24 hours."}
            </p>
            {lead ? (
              <div className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm">
                <Summary label="Profession" value={getDegreeLabel(lead.professionDegree)} />
                <Summary label="Loan Type" value={getLoanProgramTypeLabel(lead.loanProgramType)} />
                <Summary label="Property State" value={lead.propertyState ?? "Pending"} />
                <Summary label="Loan Amount" value={formatCurrency(lead.purchasePrice ?? lead.estimatedHomeValue)} />
                <Summary label="Timeline" value={lead.timeline ?? "Pending"} />
                <div className="pt-2">
                  <Badge>{matched > 0 ? `${matched} rate options` : "Manual rate search in progress"}</Badge>
                </div>
              </div>
            ) : null}
            {matched === 0 ? (
              <p className="mt-5 rounded-md bg-amber-50 p-3 text-sm font-semibold text-amber-800">
                We&apos;re expanding our rate network in {lead?.propertyState ?? "your state"}. We&apos;ll notify you when new options become available.
              </p>
            ) : null}
            <div className="mt-7">
              <p className="mb-3 font-bold text-navy">While you wait, explore our guides:</p>
              <div className="grid gap-2">
                {BLOG_POSTS.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-md border border-slate-200 p-3 font-semibold text-slate-700 hover:border-gold">
                    {post.title}
                  </Link>
                ))}
              </div>
            </div>
            <LinkButton href="/compare" variant="gold" className="mt-7">
              Continue Comparing
            </LinkButton>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-bold text-navy">{value}</span>
    </div>
  );
}
