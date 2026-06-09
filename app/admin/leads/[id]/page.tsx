import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadDetail } from "@/components/admin/LeadDetail";
import { requireAdmin } from "@/lib/services/auth";
import { getLead } from "@/lib/services/leads";

export const metadata: Metadata = { title: "Lead Detail", description: "Admin lead detail view." };

export default async function AdminLeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const lead = await getLead(id);
  if (!lead) notFound();
  return (
    <main className="p-5">
      <LeadDetail lead={lead} />
    </main>
  );
}
