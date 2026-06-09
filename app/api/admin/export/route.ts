import { listLeads } from "@/lib/services/leads";
import { toCsv } from "@/lib/utils/formatting";

export async function GET() {
  const leads = await listLeads();
  const csv = toCsv(
    leads.map((lead) => ({
      id: lead.id,
      createdAt: lead.createdAt,
      status: lead.status,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      degree: lead.professionDegree,
      state: lead.propertyState,
      loanPurpose: lead.loanPurpose,
      qualityScore: lead.qualityScore,
      matchedProgramCount: lead.matchedProgramCount,
    })),
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="proloanmatch-leads.csv"`,
    },
  });
}
