import type { Metadata } from "next";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { requireAdmin } from "@/lib/services/auth";
import { getProgramById } from "@/lib/services/programs";

export const metadata: Metadata = { title: "Edit Program", description: "Edit lender program." };

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const program = await getProgramById(id);
  return (
    <main className="grid gap-5 p-5">
      <div>
        <h1 className="text-3xl font-bold text-navy">{program?.lenderName ?? "Program"}</h1>
        <p className="mt-1 text-slate-600">Edit eligibility, loan tiers, pricing notes, and state availability.</p>
      </div>
      <ProgramForm program={program} />
    </main>
  );
}
