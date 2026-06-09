import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLoanProgramTypeLabel, summarizeDegrees } from "@/lib/constants/professions";
import { requireAdmin } from "@/lib/services/auth";
import { listPrograms } from "@/lib/services/programs";
import { formatCurrency } from "@/lib/utils/formatting";

export const metadata: Metadata = { title: "Programs", description: "Lender program management." };

export default async function AdminProgramsPage() {
  await requireAdmin();
  const programs = await listPrograms();
  return (
    <main className="grid gap-5 p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-navy">Lender programs</h1>
          <p className="mt-1 text-slate-600">Program data powers the public comparison table.</p>
        </div>
        <Button type="button" variant="gold">
          New Program
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-navy text-xs uppercase tracking-[0.08em] text-white">
            <tr>
              {["Lender", "Loan Type", "Eligible", "States", "Max Total", "PMI", "Active", "Action"].map((header) => (
                <th key={header} className="px-4 py-3">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-bold text-navy">{program.lenderName}</td>
                <td className="px-4 py-3">{getLoanProgramTypeLabel(program.programType)}</td>
                <td className="px-4 py-3" title={summarizeDegrees(program.acceptedDegrees, 50)}>
                  {summarizeDegrees(program.acceptedDegrees)}
                </td>
                <td className="px-4 py-3">{program.licensedStates.length > 20 ? "Nationwide" : program.licensedStates.join(", ")}</td>
                <td className="px-4 py-3">{formatCurrency(program.maxLoanAmountTotal)}</td>
                <td className="px-4 py-3">
                  <Badge>{program.pmiRequired ? "Required" : "None"}</Badge>
                </td>
                <td className="px-4 py-3">{program.isActive ? "Active" : "Inactive"}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/programs/${program.id}`} className="font-bold text-gold">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
