import { Badge } from "@/components/ui/badge";
import type { LeadRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils/formatting";

export function LeadDetail({ lead }: { lead: LeadRecord }) {
  const sections = [
    {
      title: "Professional Info",
      rows: [
        ["Degree", lead.professionDegree.toUpperCase()],
        ["Career Stage", lead.careerStage ?? "NA"],
        ["Credential", lead.credentialVerified ? "Verified" : "Not verified"],
        ["Credential ID", lead.credentialVerificationId ?? "NA"],
      ],
    },
    {
      title: "Loan Details",
      rows: [
        ["Purpose", lead.loanPurpose],
        ["Property", `${lead.propertyCity ?? ""} ${lead.propertyState ?? ""} ${lead.propertyZip}`],
        ["Purchase Price", formatCurrency(lead.purchasePrice)],
        ["Home Value", formatCurrency(lead.estimatedHomeValue)],
        ["Down Payment", formatCurrency(lead.downPayment)],
      ],
    },
    {
      title: "Financial Profile",
      rows: [
        ["Credit", lead.creditScoreRange ?? "NA"],
        ["Student Loans", lead.studentLoanBalanceRange ?? "NA"],
        ["Monthly Student Payment", lead.studentLoanMonthlyPaymentRange ?? "NA"],
        ["Employment", lead.employmentStatus ?? "NA"],
      ],
    },
    {
      title: "Contact Info",
      rows: [
        ["Name", `${lead.firstName} ${lead.lastName}`],
        ["Email", lead.email],
        ["Phone", lead.phone],
        ["Phone Type", lead.phoneType ?? "unknown"],
      ],
    },
    {
      title: "Verification & Source",
      rows: [
        ["IP Fraud Score", lead.ipFraudScore ?? "NA"],
        ["reCAPTCHA", lead.recaptchaScore ?? "NA"],
        ["TrustedForm", lead.trustedformCertUrl ?? "NA"],
        ["Jornaya", lead.jornayaLeadidToken ?? "NA"],
        ["UTM Source", lead.utmSource ?? "direct"],
      ],
    },
  ];

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy">
              {lead.firstName} {lead.lastName}
            </h1>
            <p className="text-sm text-slate-500">{lead.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge>{lead.status}</Badge>
            <Badge className="border-gold/30 bg-gold/10 text-navy">Score {lead.qualityScore}</Badge>
            <Badge>{lead.matchedProgramCount} matches</Badge>
          </div>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-navy">{section.title}</h2>
            <div className="grid gap-3">
              {section.rows.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-t border-slate-100 pt-3 text-sm">
                  <span className="font-semibold text-slate-500">{label}</span>
                  <span className="text-right font-bold text-slate-800">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy">Distribution History</h2>
        <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">No distribution events recorded for this lead yet.</div>
      </div>
    </div>
  );
}
