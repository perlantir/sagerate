import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" || value === null ? undefined : value);
const numericString = z.preprocess(emptyToUndefined, z.coerce.number().int().nonnegative().optional());
const booleanish = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean().optional());

export const professionDegreeSchema = z.enum([
  "md",
  "do",
  "dds",
  "dmd",
  "dpm",
  "dvm",
  "jd",
  "cpa",
  "pharmd",
  "pa",
  "np",
  "crna",
  "other",
]);

export const leadSubmissionSchema = z.object({
  intakePath: z.enum(["program_table", "multi_step_form"]),
  selectedProgramId: z.string().optional().nullable(),
  professionDegree: professionDegreeSchema,
  professionDegreeOther: z.string().max(80).optional().nullable(),
  careerStage: z
    .enum([
      "resident_fellow",
      "within_1_year_training",
      "practicing_1_5",
      "practicing_5_10",
      "practicing_10_plus",
      "student_with_contract",
    ])
    .optional()
    .nullable(),
  residencyCompletionDate: z.string().optional().nullable(),
  hasEmploymentContract: booleanish,
  yearsSinceBarAdmission: numericString,
  loanPurpose: z.enum(["purchase", "refinance", "cashout_refi", "heloc"]),
  propertyType: z.enum(["single_family", "condo_townhome", "multi_family"]).optional().nullable(),
  propertyUse: z.enum(["primary", "second_home", "investment"]).optional().nullable(),
  propertyZip: z.string().regex(/^\d{5}$/, "Enter a valid 5-digit zip code."),
  propertyState: z.string().length(2).optional().nullable(),
  propertyCity: z.string().optional().nullable(),
  purchasePrice: numericString,
  downPayment: numericString,
  currentMortgageBalance: numericString,
  estimatedHomeValue: numericString,
  creditScoreRange: z
    .enum(["excellent_740_plus", "good_680_739", "fair_620_679", "below_620", "not_sure"])
    .optional()
    .nullable(),
  timeline: z.enum(["asap", "30_days", "1_3_months", "3_6_months", "researching"]).optional().nullable(),
  studentLoanBalanceRange: z
    .enum(["none", "under_100k", "100_200k", "200_400k", "over_400k"])
    .optional()
    .nullable(),
  studentLoanMonthlyPaymentRange: z
    .enum(["zero_deferred", "under_500", "500_1500", "1500_3000", "over_3000"])
    .optional()
    .nullable(),
  onIdrPlan: z.enum(["yes", "no", "not_sure"]).optional().nullable(),
  employmentStatus: z
    .enum(["employed_w2", "self_employed", "contractor_1099", "new_position_contract", "resident_fellow", "not_employed"])
    .optional()
    .nullable(),
  firstName: z.string().trim().min(1, "First name is required.").max(80),
  lastName: z.string().trim().min(1, "Last name is required.").max(80),
  email: z.string().trim().email("Enter a valid email."),
  phone: z.string().trim().min(10, "Enter a valid phone number."),
  source: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  utmContent: z.string().optional().nullable(),
  utmTerm: z.string().optional().nullable(),
  recaptchaToken: z.string().optional().nullable(),
  trustedformCertUrl: z.string().optional().nullable(),
  jornayaLeadidToken: z.string().optional().nullable(),
  consent: z.boolean().refine((value) => value === true, "Consent is required before submitting."),
});

export const quickCaptureSchema = leadSubmissionSchema.pick({
  intakePath: true,
  selectedProgramId: true,
  professionDegree: true,
  careerStage: true,
  propertyZip: true,
  creditScoreRange: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  consent: true,
});

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;
