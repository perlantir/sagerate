import type { Metadata } from "next";
import { BuyerForm } from "@/components/admin/BuyerForm";
import { getBuyer } from "@/lib/services/admin";
import { requireAdmin } from "@/lib/services/auth";

export const metadata: Metadata = { title: "Buyer Detail", description: "Buyer detail and settings." };

export default async function BuyerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const buyer = await getBuyer(id);
  return (
    <main className="grid gap-5 p-5">
      <div>
        <h1 className="text-3xl font-bold text-navy">{buyer?.companyName ?? "Buyer"}</h1>
        <p className="mt-1 text-slate-600">Performance stats, caps, pricing, and delivery settings.</p>
      </div>
      <BuyerForm buyer={buyer} />
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-navy">Performance</h2>
        <p className="mt-2 text-sm text-slate-600">Leads sent, accepted, returned, and revenue generated appear here as distribution logs accumulate.</p>
      </div>
    </main>
  );
}
