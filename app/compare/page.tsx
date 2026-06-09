import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Landmark, UserCircle } from "lucide-react";
import { ProgramTable } from "@/components/compare/ProgramTable";
import { listPrograms } from "@/lib/services/programs";
import { listLatestComparableRateSnapshots } from "@/lib/services/rateScrapes";

export const metadata: Metadata = {
  title: "Compare Professional Mortgage Rates",
  description: "Filter and compare professional mortgage rate options by profession, state, loan amount, PMI, and student debt treatment.",
};

export default async function ComparePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const [programs, rateSnapshotsByProgram] = await Promise.all([listPrograms(), listLatestComparableRateSnapshots()]);
  return (
    <main className="min-h-screen bg-surface">
      <div className="border-b border-navy/80 bg-navy text-white">
        <div className="mx-auto flex min-h-14 max-w-[1450px] items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Landmark className="text-gold" size={18} />
            ProLoanMatch
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/70 md:flex">
            <Link href="/admin" className="hover:text-white">Dashboard</Link>
            <Link href="/compare" className="border-b-2 border-gold py-5 text-white">Compare Programs</Link>
            <Link href="/admin/analytics" className="hover:text-white">Activity</Link>
            <Link href="/blog" className="hover:text-white">Favorites</Link>
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <span className="rounded-md border border-white/15 px-2 py-1"><Heart size={15} /></span>
            <UserCircle size={20} />
            <span className="hidden sm:inline">Rate Finder</span>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1450px] p-4">
        <ProgramTable
          programs={programs}
          rateSnapshotsByProgram={rateSnapshotsByProgram}
          initialFilters={{
            programType: typeof params.programType === "string" ? params.programType : undefined,
            degree: typeof params.degree === "string" ? params.degree : undefined,
            state: typeof params.state === "string" ? params.state.toUpperCase() : undefined,
          }}
        />
      </div>
    </main>
  );
}
