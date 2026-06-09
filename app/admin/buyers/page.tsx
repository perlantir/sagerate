import type { Metadata } from "next";
import { BuyerTable } from "@/components/admin/BuyerTable";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/services/auth";
import { listBuyers } from "@/lib/services/admin";

export const metadata: Metadata = { title: "Buyers", description: "Buyer management." };

export default async function AdminBuyersPage() {
  await requireAdmin();
  const buyers = await listBuyers();
  return (
    <main className="grid gap-5 p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-navy">Buyers</h1>
          <p className="mt-1 text-slate-600">Manage lender, broker, aggregator, and credit union buyers.</p>
        </div>
        <Button type="button" variant="gold">
          New Buyer
        </Button>
      </div>
      <BuyerTable buyers={buyers} />
    </main>
  );
}
