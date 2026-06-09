import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BuyerRecord } from "@/lib/types";

export function BuyerForm({ buyer }: { buyer?: BuyerRecord | null }) {
  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Company name" defaultValue={buyer?.companyName} />
        <Field label="Contact name" defaultValue={buyer?.contactName ?? ""} />
        <Field label="Contact email" defaultValue={buyer?.contactEmail ?? ""} />
        <Field label="Contact phone" defaultValue={buyer?.contactPhone ?? ""} />
        <div>
          <Label>Buyer type</Label>
          <Select defaultValue={buyer?.buyerType ?? "direct_lender"}>
            <option value="direct_lender">Direct lender</option>
            <option value="credit_union">Credit union</option>
            <option value="aggregator">Aggregator</option>
            <option value="broker">Broker</option>
          </Select>
        </div>
        <Field label="Daily cap" type="number" defaultValue={buyer?.maxLeadsPerDay ?? ""} />
        <Field label="Exclusive price" type="number" defaultValue={buyer?.pricePerLeadExclusive ?? ""} />
        <Field label="Shared price" type="number" defaultValue={buyer?.pricePerLeadShared ?? ""} />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea defaultValue="" />
      </div>
      <Button type="button" variant="gold" className="w-fit">
        Save Buyer
      </Button>
    </form>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input {...props} />
    </div>
  );
}
