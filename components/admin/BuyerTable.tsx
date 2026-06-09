import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { BuyerRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatting";

export function BuyerTable({ buyers }: { buyers: BuyerRecord[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-navy text-xs uppercase tracking-[0.08em] text-white">
          <tr>
            {["Buyer", "Type", "Status", "Degrees", "States", "Daily Cap", "Purchased Today", "Shared Price", "Action"].map((header) => (
              <th key={header} className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {buyers.map((buyer) => (
            <tr key={buyer.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-bold text-navy">{buyer.companyName}</td>
              <td className="px-4 py-3">{buyer.buyerType}</td>
              <td className="px-4 py-3">
                <Badge>{buyer.status}</Badge>
              </td>
              <td className="px-4 py-3">{buyer.acceptedDegrees.map((degree) => degree.toUpperCase()).join(", ")}</td>
              <td className="px-4 py-3">{buyer.licensedStates.join(", ")}</td>
              <td className="px-4 py-3">{buyer.maxLeadsPerDay ?? "NA"}</td>
              <td className="px-4 py-3">{buyer.leadsPurchasedToday}</td>
              <td className="px-4 py-3">{formatCurrency(buyer.pricePerLeadShared)}</td>
              <td className="px-4 py-3">
                <Link href={`/admin/buyers/${buyer.id}`} className="font-bold text-gold">
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
