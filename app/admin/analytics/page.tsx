import type { Metadata } from "next";
import { ChartsSection } from "@/components/admin/ChartsSection";
import { getDashboardStats } from "@/lib/services/admin";
import { requireAdmin } from "@/lib/services/auth";

export const metadata: Metadata = { title: "Analytics", description: "Lead and revenue analytics." };

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const stats = await getDashboardStats();
  return (
    <main className="grid gap-5 p-5">
      <div>
        <h1 className="text-3xl font-bold text-navy">Analytics</h1>
        <p className="mt-1 text-slate-600">Revenue by profession, source, sell-through trends, quality distribution, and state performance.</p>
      </div>
      <ChartsSection stats={stats} />
    </main>
  );
}
