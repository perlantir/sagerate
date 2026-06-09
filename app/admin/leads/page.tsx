import type { Metadata } from "next";
import { LeadTable } from "@/components/admin/LeadTable";
import { LinkButton } from "@/components/ui/button";
import { requireAdmin } from "@/lib/services/auth";
import { listLeads } from "@/lib/services/leads";

export const metadata: Metadata = { title: "Leads", description: "Admin lead list." };

export default async function AdminLeadsPage() {
  await requireAdmin();
  const leads = await listLeads();
  return (
    <main className="grid gap-5 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Leads</h1>
          <p className="mt-1 text-slate-600">Sortable lead list with filters, search, export, and detail drilldown.</p>
        </div>
        <LinkButton href="/api/admin/export" variant="outline">
          Export CSV
        </LinkButton>
      </div>
      <LeadTable leads={leads} />
    </main>
  );
}
