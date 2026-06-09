import type { LeadSubmissionInput } from "@/lib/schemas/lead";

export type ScorableLead = Partial<LeadSubmissionInput> & {
  credentialVerified?: boolean;
  phoneType?: string | null;
  ipFraudScore?: number | null;
};

export function calculateLeadScore(lead: ScorableLead): number {
  let score = 0;

  if (lead.credentialVerified) score += 20;

  switch (lead.creditScoreRange) {
    case "excellent_740_plus":
      score += 15;
      break;
    case "good_680_739":
      score += 10;
      break;
    case "fair_620_679":
      score += 5;
      break;
  }

  switch (lead.careerStage) {
    case "practicing_1_5":
    case "practicing_5_10":
      score += 15;
      break;
    case "within_1_year_training":
      score += 12;
      break;
    case "practicing_10_plus":
      score += 10;
      break;
    case "resident_fellow":
      score += 5;
      break;
    case "student_with_contract":
      score += 8;
      break;
  }

  if (lead.hasEmploymentContract) score += 5;

  switch (lead.timeline) {
    case "asap":
      score += 15;
      break;
    case "30_days":
      score += 10;
      break;
    case "1_3_months":
      score += 5;
      break;
  }

  if (lead.phoneType === "mobile") score += 5;
  if (lead.studentLoanBalanceRange && lead.studentLoanBalanceRange !== "none") score += 3;
  if (lead.studentLoanBalanceRange && lead.employmentStatus && lead.onIdrPlan) score += 5;
  if (lead.trustedformCertUrl) score += 5;
  if (lead.ipFraudScore !== null && lead.ipFraudScore !== undefined && lead.ipFraudScore < 25) score += 5;

  return Math.min(score, 100);
}
