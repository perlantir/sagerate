import { subDays, format } from "date-fns";
import { getDegreeLabel } from "@/lib/constants/professions";
import { listLeads } from "@/lib/services/leads";
import { mockBuyers } from "@/lib/services/mockData";
import type { DashboardStats } from "@/lib/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  const leads = await listLeads();
  const today = new Date().toDateString();
  const revenue = leads.reduce((sum, lead) => sum + (lead.totalRevenue ?? 0), 0);
  const sold = leads.filter((lead) => lead.status === "sold" || lead.totalRevenue).length;

  return {
    totalLeads: leads.length,
    leadsToday: leads.filter((lead) => new Date(lead.createdAt).toDateString() === today).length,
    averageQualityScore: Math.round(leads.reduce((sum, lead) => sum + lead.qualityScore, 0) / Math.max(1, leads.length)),
    totalRevenue: revenue,
    sellThroughRate: Math.round((sold / Math.max(1, leads.length)) * 100),
    averageRevenuePerLead: Math.round(revenue / Math.max(1, leads.length)),
    leadsByStatus: leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.status] = (acc[lead.status] ?? 0) + 1;
      return acc;
    }, {}),
    leadsByProfession: group(leads.map((lead) => getDegreeLabel(lead.professionDegree))),
    leadsBySource: group(leads.map((lead) => lead.source ?? "direct")),
    leadsByDay: Array.from({ length: 30 }, (_, index) => {
      const date = subDays(new Date(), 29 - index);
      const dateKey = format(date, "MMM d");
      return {
        date: dateKey,
        leads: leads.filter((lead) => format(new Date(lead.createdAt), "MMM d") === dateKey).length,
      };
    }),
    leadsByState: group(leads.map((lead) => lead.propertyState ?? "NA")).slice(0, 10).map(({ name, value }) => ({ state: name, leads: value })),
  };
}

export async function listBuyers() {
  return mockBuyers;
}

export async function getBuyer(id: string) {
  return mockBuyers.find((buyer) => buyer.id === id) ?? mockBuyers[0] ?? null;
}

function group(items: string[]) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
