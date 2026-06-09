"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormProgressBar } from "@/components/form/FormProgressBar";
import { FormStepWrapper } from "@/components/form/FormStepWrapper";
import { DEGREE_OPTIONS, getDegreeLabel } from "@/lib/constants/professions";
import { CAREER_STAGES, LOAN_PURPOSES } from "@/lib/constants/loanTypes";
import { CREDIT_RANGES } from "@/lib/constants/creditRanges";
import { formatCurrency, formatPhone } from "@/lib/utils/formatting";
import { useFormStore } from "@/lib/hooks/useFormStore";
import type { LeadSubmissionInput } from "@/lib/schemas/lead";

const totalSteps = 14;

const propertyTypes = [
  { value: "single_family", label: "Single Family Home" },
  { value: "condo_townhome", label: "Condo / Townhome" },
  { value: "multi_family", label: "Multi-Family (2-4 units)" },
] as const;

const propertyUses = [
  { value: "primary", label: "Primary Residence" },
  { value: "second_home", label: "Second Home" },
  { value: "investment", label: "Investment Property" },
] as const;

export function MultiStepForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { step, data, update, next, back, setStep } = useFormStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldMessage, setFieldMessage] = useState<string | null>(null);
  const form = useForm<Partial<LeadSubmissionInput>>({ defaultValues: data });

  useEffect(() => {
    const utm = {
      utmSource: searchParams.get("utm_source") ?? undefined,
      utmMedium: searchParams.get("utm_medium") ?? undefined,
      utmCampaign: searchParams.get("utm_campaign") ?? undefined,
      utmContent: searchParams.get("utm_content") ?? undefined,
      utmTerm: searchParams.get("utm_term") ?? undefined,
      source: searchParams.get("source") ?? undefined,
    };
    if (Object.values(utm).some(Boolean)) update(utm);
  }, [searchParams, update]);

  useEffect(() => {
    void fetch("/api/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventName: "form_step_viewed", step: step + 1, sessionId: data.sessionId }),
    }).catch(() => undefined);
  }, [step, data.sessionId]);

  const visibleStep = useMemo(() => {
    if (data.loanPurpose !== "purchase" && step === 7) return "down-payment-skipped";
    return step;
  }, [data.loanPurpose, step]);

  function choose(patch: Partial<LeadSubmissionInput>, autoAdvance = true) {
    update(patch);
    Object.entries(patch).forEach(([key, value]) => form.setValue(key as keyof LeadSubmissionInput, value));
    if (autoAdvance) window.setTimeout(() => next(), 180);
  }

  function skipDownPaymentIfNeeded() {
    if (visibleStep === "down-payment-skipped") {
      setStep(8);
      return true;
    }
    return false;
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    const payload = {
      ...data,
      ...form.getValues(),
      intakePath: "multi_step_form",
      loanPurpose: data.loanPurpose ?? "purchase",
      propertyZip: data.propertyZip ?? "",
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      consent: data.consent === true,
    };
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json().catch(() => ({}))) as { leadId?: string; error?: string };
    setSubmitting(false);
    if (!response.ok || !result.leadId) {
      setError(result.error ?? "We could not submit your match request.");
      return;
    }
    router.push(`/thank-you?leadId=${result.leadId}`);
  }

  function continueClick() {
    if (skipDownPaymentIfNeeded()) return;
    if (step === 13) {
      void submit();
      return;
    }
    next();
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <FormProgressBar step={step} total={totalSteps} />
      <div className="mt-6 min-h-[420px]">
        <FormStepWrapper>
          {renderStep({
            step,
            data,
            choose,
            update,
            setFieldMessage,
          })}
        </FormStepWrapper>
      </div>
      {fieldMessage ? <p className="rounded-md bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">{fieldMessage}</p> : null}
      {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p> : null}
      <div className="mt-6 flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={back} disabled={step === 0 || submitting}>
          <ArrowLeft size={16} />
          Back
        </Button>
        <Button type="button" variant="gold" onClick={continueClick} disabled={submitting}>
          {submitting ? <Loader2 className="animate-spin" size={16} /> : null}
          {step === 13 ? "See My Rate Options" : "Continue"}
        </Button>
      </div>
      <p className="mt-7 text-center text-xs font-semibold text-slate-500">Your information is secure and will only be used to show relevant rate options.</p>
    </div>
  );
}

function renderStep({
  step,
  data,
  choose,
  update,
  setFieldMessage,
}: {
  step: number;
  data: Partial<LeadSubmissionInput> & { zipConfirmation?: string };
  choose: (patch: Partial<LeadSubmissionInput>, autoAdvance?: boolean) => void;
  update: (patch: Partial<LeadSubmissionInput> & { zipConfirmation?: string }) => void;
  setFieldMessage: (message: string | null) => void;
}) {
  switch (step) {
    case 0:
      return (
        <Question title="What is your professional degree?">
          <div className="grid gap-3 sm:grid-cols-2">
            {DEGREE_OPTIONS.map((option) => (
              <ChoiceCard
                key={option.value}
                selected={data.professionDegree === option.value}
                title={option.label}
                body={option.fullTitle}
                onClick={() => choose({ professionDegree: option.value })}
              />
            ))}
          </div>
          {data.professionDegree === "other" ? (
            <Input placeholder="Specify your professional degree" onChange={(event) => update({ professionDegreeOther: event.target.value })} />
          ) : null}
        </Question>
      );
    case 1:
      return (
        <Question title={careerQuestion(data.professionDegree)}>
          <div className="grid gap-3">
            {CAREER_STAGES.filter((stage) => stage.value !== "resident_fellow" || isMedical(data.professionDegree)).map((stage) => (
              <ChoiceCard
                key={stage.value}
                selected={data.careerStage === stage.value}
                title={stage.label}
                onClick={() => choose({ careerStage: stage.value })}
              />
            ))}
          </div>
          {data.careerStage === "resident_fellow" ? (
            <Input type="date" onChange={(event) => update({ residencyCompletionDate: event.target.value })} />
          ) : null}
          {data.professionDegree === "jd" ? (
            <Input
              type="number"
              placeholder="Years since bar admission"
              onChange={(event) => update({ yearsSinceBarAdmission: Number(event.target.value) })}
            />
          ) : null}
        </Question>
      );
    case 2:
      return (
        <Question title="What rate options are you looking for?">
          <div className="grid gap-3 sm:grid-cols-2">
            {LOAN_PURPOSES.map((purpose) => (
              <ChoiceCard
                key={purpose.value}
                selected={data.loanPurpose === purpose.value}
                title={purpose.label}
                onClick={() => choose({ loanPurpose: purpose.value })}
              />
            ))}
          </div>
        </Question>
      );
    case 3:
      return (
        <Question title="What type of property?">
          <div className="grid gap-3">
            {propertyTypes.map((type) => (
              <ChoiceCard key={type.value} selected={data.propertyType === type.value} title={type.label} onClick={() => choose({ propertyType: type.value })} />
            ))}
          </div>
        </Question>
      );
    case 4:
      return (
        <Question title="How will this property be used?">
          <div className="grid gap-3">
            {propertyUses.map((use) => (
              <ChoiceCard key={use.value} selected={data.propertyUse === use.value} title={use.label} onClick={() => choose({ propertyUse: use.value })} />
            ))}
          </div>
          {data.propertyUse === "investment" ? (
            <p className="rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-800">
              Most professional loan programs require a primary residence. We&apos;ll still find competitive options for you.
            </p>
          ) : null}
        </Question>
      );
    case 5:
      return (
        <Question title="Where is the property located?">
          <Input
            inputMode="numeric"
            maxLength={5}
            placeholder="Zip code"
            value={data.propertyZip ?? ""}
            onChange={(event) => {
              const zip = event.target.value.replace(/\D/g, "").slice(0, 5);
              update({ propertyZip: zip, zipConfirmation: zip.length === 5 ? inferZipConfirmation(zip) : undefined });
              if (zip.length === 5) setFieldMessage(inferZipConfirmation(zip));
            }}
          />
          {data.zipConfirmation ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={16} />
              {data.zipConfirmation}
            </div>
          ) : null}
        </Question>
      );
    case 6:
      return (
        <Question title={data.loanPurpose === "purchase" ? "What is the expected purchase price?" : "What is your home's estimated value?"}>
          <PriceInput
            value={data.loanPurpose === "purchase" ? data.purchasePrice : data.estimatedHomeValue}
            onChange={(value) => update(data.loanPurpose === "purchase" ? { purchasePrice: value } : { estimatedHomeValue: value })}
          />
          {data.loanPurpose !== "purchase" ? (
            <Input
              inputMode="numeric"
              placeholder="Current mortgage balance"
              onChange={(event) => update({ currentMortgageBalance: Number(event.target.value.replace(/[^\d]/g, "")) })}
            />
          ) : null}
        </Question>
      );
    case 7:
      if (data.loanPurpose !== "purchase") {
        return <Question title="Down payment is skipped for refinance requests." />;
      }
      return (
        <Question title="How much do you plan to put down?">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["0", "$0 (0% down)"],
              ["5", "Up to 5%"],
              ["10", "5-10%"],
              ["20", "10-20%"],
              ["25", "20%+"],
            ].map(([value, label]) => (
              <ChoiceCard key={value} selected={String(data.downPayment ?? "") === value} title={label} onClick={() => choose({ downPayment: Number(value) }, false)} />
            ))}
          </div>
          <p className="text-sm font-semibold text-gold">Many professional loan programs offer 0% down with no PMI.</p>
        </Question>
      );
    case 8:
      return (
        <Question title="Tell us about your student loans">
          <ChipGroup
            label="Approximate total student loan balance"
            value={data.studentLoanBalanceRange}
            options={[
              ["none", "None"],
              ["under_100k", "Under $100K"],
              ["100_200k", "$100K-$200K"],
              ["200_400k", "$200K-$400K"],
              ["over_400k", "Over $400K"],
            ]}
            onChange={(value) => update({ studentLoanBalanceRange: value as LeadSubmissionInput["studentLoanBalanceRange"] })}
          />
          <ChipGroup
            label="Current monthly student loan payment"
            value={data.studentLoanMonthlyPaymentRange}
            options={[
              ["zero_deferred", "$0 deferred"],
              ["under_500", "Under $500"],
              ["500_1500", "$500-$1,500"],
              ["1500_3000", "$1,500-$3,000"],
              ["over_3000", "Over $3,000"],
            ]}
            onChange={(value) => update({ studentLoanMonthlyPaymentRange: value as LeadSubmissionInput["studentLoanMonthlyPaymentRange"] })}
          />
          <ChipGroup
            label="Are you on an Income-Driven Repayment plan?"
            value={data.onIdrPlan}
            options={[
              ["yes", "Yes"],
              ["no", "No"],
              ["not_sure", "Not sure"],
            ]}
            onChange={(value) => update({ onIdrPlan: value as LeadSubmissionInput["onIdrPlan"] })}
          />
        </Question>
      );
    case 9:
      return (
        <Question title="What is your estimated credit score?">
          <div className="grid gap-3">
            {CREDIT_RANGES.map((range) => (
              <ChoiceCard
                key={range.value}
                selected={data.creditScoreRange === range.value}
                title={`${range.label} (${range.helper})`}
                className={range.color}
                onClick={() => choose({ creditScoreRange: range.value })}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-slate-500">This won&apos;t affect your credit score.</p>
        </Question>
      );
    case 10:
      return (
        <Question title="When do you need to close?">
          <div className="grid gap-3">
            {[
              ["asap", "ASAP / Under Contract"],
              ["30_days", "Within 30 Days"],
              ["1_3_months", "1-3 Months"],
              ["3_6_months", "3-6 Months"],
              ["researching", "Just Researching"],
            ].map(([value, label]) => (
              <ChoiceCard key={value} selected={data.timeline === value} title={label} onClick={() => choose({ timeline: value as LeadSubmissionInput["timeline"] })} />
            ))}
          </div>
        </Question>
      );
    case 11:
      return (
        <Question title="What is your employment situation?">
          <div className="grid gap-3">
            {[
              ["employed_w2", "Employed (W-2)"],
              ["self_employed", "Self-Employed / Private Practice"],
              ["contractor_1099", "Independent Contractor (1099)"],
              ["new_position_contract", "Starting New Position"],
              ["resident_fellow", "Resident/Fellow"],
              ["not_employed", "Not Currently Employed"],
            ].map(([value, label]) => (
              <ChoiceCard key={value} selected={data.employmentStatus === value} title={label} onClick={() => choose({ employmentStatus: value as LeadSubmissionInput["employmentStatus"] }, false)} />
            ))}
          </div>
          {data.employmentStatus === "new_position_contract" ? (
            <ChipGroup
              label="Do you have a signed employment contract?"
              value={data.hasEmploymentContract ? "yes" : data.hasEmploymentContract === false ? "no" : undefined}
              options={[
                ["yes", "Yes"],
                ["no", "No"],
              ]}
              onChange={(value) => update({ hasEmploymentContract: value === "yes" })}
            />
          ) : null}
        </Question>
      );
    case 12:
      return (
        <Question title="Where should we send your matched program results?">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="First Name" value={data.firstName ?? ""} onChange={(event) => update({ firstName: event.target.value })} />
            <Input placeholder="Last Name" value={data.lastName ?? ""} onChange={(event) => update({ lastName: event.target.value })} />
            <Input
              type="email"
              placeholder="Email"
              value={data.email ?? ""}
              onBlur={async (event) => {
                const response = await fetch("/api/validate/email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: event.target.value }),
                });
                const result = (await response.json()) as { valid: boolean };
                setFieldMessage(result.valid ? "Email looks valid." : "Enter a valid email address.");
              }}
              onChange={(event) => update({ email: event.target.value })}
            />
            <Input
              placeholder="Phone"
              value={data.phone ?? ""}
              onChange={(event) => update({ phone: formatPhone(event.target.value) })}
            />
          </div>
        </Question>
      );
    case 13:
      return (
        <Question title="Consent & Submit">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 text-sm font-bold text-navy">Your rate search summary</div>
            <div className="flex flex-wrap gap-2">
              <Badge>{getDegreeLabel(data.professionDegree)}</Badge>
              <Badge>{data.loanPurpose ?? "purchase"}</Badge>
              <Badge>{data.propertyZip ?? "Zip pending"}</Badge>
              <Badge>{data.creditScoreRange ?? "Credit pending"}</Badge>
            </div>
          </div>
          <div className="max-h-32 overflow-auto rounded-md border border-slate-200 p-3 text-xs leading-5 text-slate-600">
            By checking this box and clicking Submit, I provide my express written consent to be contacted by ProLoanMatch and up to 4 matched lending partners
            who offer professional mortgage rate options, at the phone number provided, including by automated means. Consent is not required to purchase any product
            or service. Msg & data rates may apply.
          </div>
          <label className="flex gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={data.consent === true}
              onChange={(event) => update({ consent: event.target.checked })}
              className="mt-1 h-4 w-4 accent-gold"
            />
            I agree to the consent terms and acknowledge the Privacy Policy and Terms of Service.
          </label>
        </Question>
      );
    default:
      return null;
  }
}

function Question({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="grid gap-5">
      <h1 className="text-2xl font-bold leading-tight text-navy sm:text-3xl">{title}</h1>
      {children}
    </div>
  );
}

function ChoiceCard({
  title,
  body,
  selected,
  onClick,
  className,
}: {
  title: string;
  body?: string;
  selected?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`gold-focus rounded-lg border p-4 text-left transition hover:border-gold hover:shadow-sm ${
        selected ? "border-gold bg-gold/10 text-navy" : "border-slate-200 bg-white text-slate-800"
      } ${className ?? ""}`}
    >
      <span className="block text-base font-bold">{title}</span>
      {body ? <span className="mt-1 block text-sm text-slate-500">{body}</span> : null}
    </button>
  );
}

function ChipGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value?: string | null | boolean;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm font-bold text-navy">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(([optionValue, label]) => (
          <button
            type="button"
            key={optionValue}
            onClick={() => onChange(optionValue)}
            className={`gold-focus rounded-full border px-3 py-2 text-sm font-semibold ${
              value === optionValue ? "border-gold bg-gold/10 text-navy" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PriceInput({ value, onChange }: { value?: number | null; onChange: (value: number) => void }) {
  const current = value ?? 750000;
  return (
    <div className="grid gap-3">
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-3xl font-bold text-navy">{formatCurrency(current)}</div>
      <input
        type="range"
        min={100000}
        max={3000000}
        step={25000}
        value={current}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-gold"
      />
      <Input inputMode="numeric" value={String(current)} onChange={(event) => onChange(Number(event.target.value.replace(/[^\d]/g, "")))} />
    </div>
  );
}

function isMedical(degree?: string | null) {
  return ["md", "do", "dds", "dmd", "dpm", "dvm"].includes(degree ?? "");
}

function careerQuestion(degree?: string | null) {
  if (isMedical(degree)) return "Where are you in your medical career?";
  if (degree === "jd") return "Where are you in your legal career?";
  if (degree === "cpa") return "How long have you been licensed?";
  return "Where are you in your career?";
}

function inferZipConfirmation(zip: string) {
  const prefix = zip.slice(0, 1);
  const state = prefix === "9" ? "CA" : prefix === "7" ? "TX" : prefix === "6" ? "IL" : prefix === "3" ? "FL" : prefix === "2" ? "DC" : "NY";
  return `Confirmed property market: ${state}`;
}
