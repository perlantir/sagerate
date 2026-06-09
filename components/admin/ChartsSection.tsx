"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardStats } from "@/lib/types";

const colors = ["#0F2B46", "#C5975B", "#1F8A5B", "#61738C", "#8B5E34", "#3C6E91"];

export function ChartsSection({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartFrame title="Leads per day">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={stats.leadsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="leads" stroke="#0F2B46" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartFrame>
      <ChartFrame title="Profession breakdown">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={stats.leadsByProfession} dataKey="value" nameKey="name" outerRadius={92} label>
              {stats.leadsByProfession.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartFrame>
      <ChartFrame title="Source performance">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.leadsBySource}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#C5975B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
      <ChartFrame title="Top states">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={stats.leadsByState}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="state" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="leads" fill="#0F2B46" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartFrame>
    </div>
  );
}

function ChartFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-navy">{title}</h2>
      {children}
    </div>
  );
}
