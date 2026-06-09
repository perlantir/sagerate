import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LenderProgram } from "@/lib/types";

export function ProgramForm({ program }: { program?: LenderProgram | null }) {
  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Lender name" defaultValue={program?.lenderName} />
        <Field label="Program name" defaultValue={program?.programName} />
        <Field label="Max 0% down" type="number" defaultValue={program?.maxLoanAmountZeroDown ?? ""} />
        <Field label="Max total loan" type="number" defaultValue={program?.maxLoanAmountTotal ?? ""} />
        <div>
          <Label>Student loan treatment</Label>
          <Select defaultValue={program?.studentLoanTreatment ?? "varies"}>
            <option value="excluded">Excluded</option>
            <option value="ibr_payment">IBR payment</option>
            <option value="full_payment">Full payment</option>
            <option value="varies">Varies</option>
          </Select>
        </div>
        <div>
          <Label>PMI required</Label>
          <Select defaultValue={program?.pmiRequired ? "yes" : "no"}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </Select>
        </div>
      </div>
      <div>
        <Label>Program notes</Label>
        <Textarea defaultValue={program?.programNotes ?? ""} />
      </div>
      <Button type="button" variant="gold" className="w-fit">
        Save Program
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
