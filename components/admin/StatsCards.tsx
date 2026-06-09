import { BadgeDollarSign, Gauge, Target, Users } from "lucide-react";
import type { DashboardStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatting";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Total Leads", value: stats.totalLeads, icon: Users },
    { label: "Rate Match Score", value: stats.averageQualityScore, icon: Gauge },
    { label: "Sell-Through Rate", value: `${stats.sellThroughRate}%`, icon: Target },
    { label: "Total Revenue", value: formatCurrency(stats.totalRevenue), icon: BadgeDollarSign },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">{card.label}</span>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold/12 text-gold">
              <card.icon size={19} />
            </span>
          </div>
          <div className="mt-4 text-3xl font-bold text-navy">{card.value}</div>
        </div>
      ))}
    </div>
  );
}
