"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEGREE_OPTIONS, getLoanProgramTypeLabel } from "@/lib/constants/professions";
import { CAREER_STAGES } from "@/lib/constants/loanTypes";
import { CREDIT_RANGES } from "@/lib/constants/creditRanges";
import type { LenderProgram } from "@/lib/types";

export function QuickCaptureModal({
  program,
  defaultDegree,
  defaultCareerStage,
  onClose,
}: {
  program: LenderProgram | null;
  defaultDegree: string;
  defaultCareerStage: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!program) return null;
  const degreeOptions = DEGREE_OPTIONS.filter((option) => program.acceptedDegrees.includes(option.value));
  const defaultProfessionDegree = degreeOptions.find((option) => option.value === defaultDegree)?.value ?? degreeOptions[0]?.value ?? program.acceptedDegrees[0];

  async function submit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        intakePath: "program_table",
        loanProgramType: program?.programType,
        selectedProgramId: program?.id,
        loanPurpose: "purchase",
        consent: formData.get("consent") === "on",
      }),
    });
    const data = (await response.json().catch(() => ({}))) as { leadId?: string; error?: string };
    setSubmitting(false);
    if (!response.ok) {
      setError(data.error ?? "We could not submit your rate request.");
      return;
    }
    router.push(`/thank-you?leadId=${data.leadId}`);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-navy/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="text-sm font-semibold text-gold">{program.lenderName}</p>
            <h2 className="text-2xl font-bold text-navy">Rate options preview</h2>
            <p className="mt-1 text-sm text-slate-600">Answer a few details to see professional mortgage rate options for this program.</p>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-500">{getLoanProgramTypeLabel(program.programType)}</p>
          </div>
          <button type="button" onClick={onClose} className="gold-focus rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <form action={submit} className="grid gap-4 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="firstName" label="First Name" required />
            <Field name="lastName" label="Last Name" required />
            <Field name="email" label="Email" type="email" required />
            <Field name="phone" label="Phone" required />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="professionDegree">Degree Type</Label>
              <Select id="professionDegree" name="professionDegree" defaultValue={defaultProfessionDegree}>
                {degreeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label htmlFor="careerStage">Career Stage</Label>
              <Select id="careerStage" name="careerStage" defaultValue={defaultCareerStage === "all" ? "practicing_1_5" : defaultCareerStage}>
                {CAREER_STAGES.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field name="propertyZip" label="Property Zip" inputMode="numeric" maxLength={5} required />
            <div>
              <Label htmlFor="creditScoreRange">Credit Score Range</Label>
              <Select id="creditScoreRange" name="creditScoreRange" defaultValue="good_680_739">
                {CREDIT_RANGES.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label} ({range.helper})
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <label className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs leading-5 text-slate-600">
            <input name="consent" type="checkbox" className="mt-1 h-4 w-4 accent-gold" required />
            <span>
              I provide express written consent to be contacted by ProLoanMatch and up to 4 matched lending partners about mortgage rate options, including by automated means.
            </span>
          </label>
          {error ? <p className="rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
          <Button type="submit" variant="gold" disabled={submitting}>
            {submitting ? "Submitting..." : "Get My Rate Options"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <div>
      <Label htmlFor={props.name}>{label}</Label>
      <Input id={props.name} {...props} />
    </div>
  );
}
