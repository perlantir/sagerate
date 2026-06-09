import type { Metadata } from "next";
import { ChartsSection } from "@/components/admin/ChartsSection";
import { RecentLeadsFeed } from "@/components/admin/RecentLeadsFeed";
import { StatsCards } from "@/components/admin/StatsCards";
import { getDashboardStats } from "@/lib/services/admin";
import { requireAdmin } from "@/lib/services/auth";
import { listLeads } from "@/lib/services/leads";

export const metadata: Metadata = { title: "Admin Dashboard", description: "Lead and revenue dashboard." };

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [stats, leads] = await Promise.all([getDashboardStats(), listLeads()]);
  return (
    <main className="grid gap-5 p-5">
      <StatsCards stats={stats} />
      <ChartsSection stats={stats} />
      <RecentLeadsFeed leads={leads} />
    </main>
  );
}
