export type ProfessionDegree =
  | "md"
  | "do"
  | "dds"
  | "dmd"
  | "dpm"
  | "dvm"
  | "jd"
  | "cpa"
  | "pharmd"
  | "pa"
  | "np"
  | "crna"
  | "other";

export type LeadStatus =
  | "new"
  | "verified"
  | "credential_verified"
  | "distributed"
  | "sold"
  | "rejected"
  | "returned";

export type IntakePath = "program_table" | "multi_step_form";

export type CareerStage =
  | "resident_fellow"
  | "within_1_year_training"
  | "practicing_1_5"
  | "practicing_5_10"
  | "practicing_10_plus"
  | "student_with_contract";

export type LoanPurpose = "purchase" | "refinance" | "cashout_refi" | "heloc";

export type CreditScoreRange =
  | "excellent_740_plus"
  | "good_680_739"
  | "fair_620_679"
  | "below_620"
  | "not_sure";

export type LenderProgram = {
  id: string;
  lenderName: string;
  programName: string;
  acceptedDegrees: ProfessionDegree[];
  acceptsResidents: boolean;
  yearsFromTrainingMax: number | null;
  maxLoanAmountZeroDown: number | null;
  maxLoanAmount5Down: number | null;
  maxLoanAmount10Down: number | null;
  maxLoanAmountTotal: number | null;
  pmiRequired: boolean;
  rateTypesAvailable: string[];
  studentLoanTreatment: "excluded" | "ibr_payment" | "full_payment" | "varies";
  licensedStates: string[];
  requiresEmploymentContract: boolean;
  contractStartWindowDays?: number | null;
  refinanceAvailable: boolean;
  cashOutAvailable: boolean;
  fixedRateEstimate?: number | null;
  armRateEstimate?: number | null;
  lenderWebsiteUrl?: string | null;
  programNotes?: string | null;
  isActive: boolean;
  displayOrder: number;
  lastVerified?: string | null;
};

export type LeadRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: LeadStatus;
  qualityScore: number;
  source?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  intakePath: IntakePath;
  selectedProgramId?: string | null;
  professionDegree: ProfessionDegree;
  professionDegreeOther?: string | null;
  careerStage?: CareerStage | null;
  credentialVerified: boolean;
  credentialVerificationSource?: string | null;
  credentialVerificationId?: string | null;
  loanPurpose: LoanPurpose;
  propertyZip: string;
  propertyState?: string | null;
  propertyCity?: string | null;
  purchasePrice?: number | null;
  downPayment?: number | null;
  currentMortgageBalance?: number | null;
  estimatedHomeValue?: number | null;
  creditScoreRange?: CreditScoreRange | null;
  timeline?: string | null;
  studentLoanBalanceRange?: string | null;
  studentLoanMonthlyPaymentRange?: string | null;
  onIdrPlan?: string | null;
  employmentStatus?: string | null;
  hasEmploymentContract?: boolean | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  phoneType?: "mobile" | "landline" | "voip" | "unknown";
  ipAddress?: string | null;
  ipFraudScore?: number | null;
  userAgent?: string | null;
  recaptchaScore?: number | null;
  trustedformCertUrl?: string | null;
  jornayaLeadidToken?: string | null;
  isDuplicate?: boolean;
  duplicateOfLeadId?: string | null;
  matchedProgramCount: number;
  totalRevenue?: number | null;
};

export type BuyerRecord = {
  id: string;
  companyName: string;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  buyerType: "direct_lender" | "credit_union" | "aggregator" | "broker";
  licensedStates: string[];
  acceptedDegrees: ProfessionDegree[];
  acceptsResidents: boolean;
  maxLeadsPerDay?: number | null;
  maxLeadsPerMonth?: number | null;
  leadsPurchasedToday: number;
  leadsPurchasedThisMonth: number;
  pricePerLeadExclusive?: number | null;
  pricePerLeadShared?: number | null;
  status: "active" | "paused" | "onboarding" | "churned";
  requiresTrustedform: boolean;
  requiresJornaya: boolean;
  acceptsVoip: boolean;
};

export type DashboardStats = {
  totalLeads: number;
  leadsToday: number;
  averageQualityScore: number;
  totalRevenue: number;
  sellThroughRate: number;
  averageRevenuePerLead: number;
  leadsByStatus: Record<string, number>;
  leadsByProfession: Array<{ name: string; value: number }>;
  leadsBySource: Array<{ name: string; value: number }>;
  leadsByDay: Array<{ date: string; leads: number }>;
  leadsByState: Array<{ state: string; leads: number }>;
};
