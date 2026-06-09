import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { LeadRecord } from "@/lib/types";

export function RecentLeadsFeed({ leads }: { leads: LeadRecord[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-navy">Recent leads</h2>
        <Link href="/admin/leads" className="text-sm font-bold text-gold">
          View all
        </Link>
      </div>
      <div className="grid gap-3">
        {leads.slice(0, 20).map((lead) => (
          <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="grid gap-2 rounded-md border border-slate-100 p-3 transition hover:border-gold/50">
            <div className="flex items-center justify-between gap-3">
              <span className="font-bold text-navy">
                {lead.firstName} {lead.lastName}
              </span>
              <Badge>{lead.status}</Badge>
            </div>
            <div className="text-sm text-slate-600">
              {lead.professionDegree.toUpperCase()} · {lead.propertyState ?? "NA"} · Score {lead.qualityScore}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
