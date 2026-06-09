import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getDegreeLabel, getLoanProgramTypeLabel } from "@/lib/constants/professions";
import type { LeadRecord } from "@/lib/types";

export function LeadTable({ leads }: { leads: LeadRecord[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="table-scroll overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-navy text-xs uppercase tracking-[0.08em] text-white">
            <tr>
              {["Date", "Name", "Loan Type", "Profession", "Career Stage", "State", "Loan Purpose", "Credit", "Quality", "Status", "Actions"].map((header) => (
                <th key={header} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-600">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-bold text-navy">
                  {lead.firstName} {lead.lastName}
                </td>
                <td className="px-4 py-3">{getLoanProgramTypeLabel(lead.loanProgramType)}</td>
                <td className="px-4 py-3">{getDegreeLabel(lead.professionDegree)}</td>
                <td className="px-4 py-3 text-slate-600">{lead.careerStage ?? "NA"}</td>
                <td className="px-4 py-3">{lead.propertyState ?? "NA"}</td>
                <td className="px-4 py-3">{lead.loanPurpose}</td>
                <td className="px-4 py-3">{lead.creditScoreRange ?? "NA"}</td>
                <td className="px-4 py-3 font-bold">{lead.qualityScore}</td>
                <td className="px-4 py-3">
                  <Badge>{lead.status}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-bold text-gold">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
