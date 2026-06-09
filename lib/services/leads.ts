import { and, desc, eq, gte, or } from "drizzle-orm";
import { getDb, hasDatabase } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { mockLeads } from "@/lib/services/mockData";
import type { LeadRecord, LeadStatus } from "@/lib/types";
import type { LeadSubmissionInput } from "@/lib/schemas/lead";

const globalLeadStore = globalThis as typeof globalThis & {
  __proloanmatchLeads?: LeadRecord[];
};

const memoryLeads = globalLeadStore.__proloanmatchLeads ?? (globalLeadStore.__proloanmatchLeads = [...mockLeads]);

export async function listLeads(filters: { status?: string | null; search?: string | null } = {}) {
  if (hasDatabase()) {
    const db = getDb();
    if (db) {
      const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(200);
      return rows.map(rowToLeadRecord);
    }
  }

  return memoryLeads
    .filter((lead) => !filters.status || filters.status === "all" || lead.status === filters.status)
    .filter((lead) => {
      if (!filters.search) return true;
      const needle = filters.search.toLowerCase();
      return [lead.firstName, lead.lastName, lead.email, lead.phone].some((value) => value?.toLowerCase().includes(needle));
    })
    .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

export async function getLead(id: string) {
  if (hasDatabase()) {
    const db = getDb();
    if (db) {
      const [row] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
      return row ? rowToLeadRecord(row) : null;
    }
  }
  return memoryLeads.find((lead) => lead.id === id) ?? null;
}

export async function createLeadRecord(
  input: LeadSubmissionInput,
  enrichment: Partial<LeadRecord>,
): Promise<LeadRecord> {
  const now = new Date().toISOString();
  const record: LeadRecord = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    status: enrichment.credentialVerified ? "credential_verified" : "new",
    qualityScore: enrichment.qualityScore ?? 0,
    intakePath: input.intakePath,
    selectedProgramId: input.selectedProgramId ?? null,
    professionDegree: input.professionDegree,
    professionDegreeOther: input.professionDegreeOther ?? null,
    careerStage: input.careerStage ?? null,
    credentialVerified: Boolean(enrichment.credentialVerified),
    credentialVerificationSource: enrichment.credentialVerificationSource ?? null,
    credentialVerificationId: enrichment.credentialVerificationId ?? null,
    loanPurpose: input.loanPurpose,
    propertyZip: input.propertyZip,
    propertyState: enrichment.propertyState ?? input.propertyState ?? null,
    propertyCity: enrichment.propertyCity ?? input.propertyCity ?? null,
    purchasePrice: input.purchasePrice ?? null,
    downPayment: input.downPayment ?? null,
    currentMortgageBalance: input.currentMortgageBalance ?? null,
    estimatedHomeValue: input.estimatedHomeValue ?? null,
    creditScoreRange: input.creditScoreRange ?? null,
    timeline: input.timeline ?? null,
    studentLoanBalanceRange: input.studentLoanBalanceRange ?? null,
    studentLoanMonthlyPaymentRange: input.studentLoanMonthlyPaymentRange ?? null,
    onIdrPlan: input.onIdrPlan ?? null,
    employmentStatus: input.employmentStatus ?? null,
    hasEmploymentContract: input.hasEmploymentContract ?? null,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    phoneType: enrichment.phoneType ?? "unknown",
    ipAddress: enrichment.ipAddress ?? null,
    ipFraudScore: enrichment.ipFraudScore ?? null,
    userAgent: enrichment.userAgent ?? null,
    recaptchaScore: enrichment.recaptchaScore ?? null,
    trustedformCertUrl: input.trustedformCertUrl ?? null,
    jornayaLeadidToken: input.jornayaLeadidToken ?? null,
    isDuplicate: enrichment.isDuplicate ?? false,
    duplicateOfLeadId: enrichment.duplicateOfLeadId ?? null,
    matchedProgramCount: enrichment.matchedProgramCount ?? 0,
    totalRevenue: null,
    source: input.source ?? input.utmSource ?? null,
    utmSource: input.utmSource ?? null,
    utmMedium: input.utmMedium ?? null,
    utmCampaign: input.utmCampaign ?? null,
    utmContent: input.utmContent ?? null,
    utmTerm: input.utmTerm ?? null,
  };

  if (hasDatabase()) {
    const db = getDb();
    if (db) {
      // TODO Phase 2: encrypt firstName, lastName, email, and phone at the application layer before storage.
      const insertValues = {
        status: record.status,
        qualityScore: record.qualityScore,
        source: record.source,
        utmSource: record.utmSource,
        utmMedium: record.utmMedium,
        utmCampaign: record.utmCampaign,
        utmContent: record.utmContent,
        utmTerm: record.utmTerm,
        intakePath: record.intakePath,
        selectedProgramId: record.selectedProgramId,
        professionDegree: record.professionDegree,
        professionDegreeOther: record.professionDegreeOther,
        credentialVerified: record.credentialVerified,
        credentialVerificationSource: record.credentialVerificationSource,
        credentialVerificationId: record.credentialVerificationId,
        careerStage: record.careerStage,
        hasEmploymentContract: record.hasEmploymentContract,
        loanPurpose: record.loanPurpose,
        propertyZip: record.propertyZip,
        propertyState: record.propertyState,
        propertyCity: record.propertyCity,
        purchasePrice: record.purchasePrice,
        downPayment: record.downPayment,
        currentMortgageBalance: record.currentMortgageBalance,
        estimatedHomeValue: record.estimatedHomeValue,
        creditScoreRange: record.creditScoreRange,
        timeline: record.timeline,
        studentLoanBalanceRange: record.studentLoanBalanceRange,
        studentLoanMonthlyPaymentRange: record.studentLoanMonthlyPaymentRange,
        onIdrPlan: record.onIdrPlan,
        employmentStatus: record.employmentStatus,
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        phone: record.phone,
        phoneType: record.phoneType,
        ipAddress: record.ipAddress,
        ipFraudScore: record.ipFraudScore,
        userAgent: record.userAgent,
        recaptchaScore: record.recaptchaScore ? String(record.recaptchaScore) : null,
        trustedformCertUrl: record.trustedformCertUrl,
        jornayaLeadidToken: record.jornayaLeadidToken,
        isDuplicate: record.isDuplicate,
        duplicateOfLeadId: record.duplicateOfLeadId,
        matchedProgramCount: record.matchedProgramCount,
      };
      const [inserted] = await db
        .insert(leads)
        .values(insertValues as typeof leads.$inferInsert)
        .returning();
      return rowToLeadRecord(inserted);
    }
  }

  memoryLeads.unshift(record);
  return record;
}

export async function updateLeadStatus(id: string, status: LeadStatus) {
  if (hasDatabase()) {
    const db = getDb();
    if (db) {
      const [row] = await db.update(leads).set({ status, updatedAt: new Date() }).where(eq(leads.id, id)).returning();
      return row ? rowToLeadRecord(row) : null;
    }
  }
  const lead = memoryLeads.find((item) => item.id === id);
  if (!lead) return null;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  return lead;
}

export async function findDuplicateLead(email: string, phone: string) {
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  if (hasDatabase()) {
    const db = getDb();
    if (db) {
      const [row] = await db
        .select()
        .from(leads)
        .where(and(gte(leads.createdAt, cutoff), or(eq(leads.email, email), eq(leads.phone, phone))))
        .limit(1);
      return row ? rowToLeadRecord(row) : null;
    }
  }
  return memoryLeads.find((lead) => Date.parse(lead.createdAt) >= cutoff.getTime() && (lead.email === email || lead.phone === phone)) ?? null;
}

function rowToLeadRecord(row: typeof leads.$inferSelect): LeadRecord {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    status: row.status,
    qualityScore: row.qualityScore ?? 0,
    source: row.source,
    utmSource: row.utmSource,
    utmMedium: row.utmMedium,
    utmCampaign: row.utmCampaign,
    utmContent: row.utmContent,
    utmTerm: row.utmTerm,
    intakePath: row.intakePath,
    selectedProgramId: row.selectedProgramId,
    professionDegree: row.professionDegree,
    professionDegreeOther: row.professionDegreeOther,
    careerStage: row.careerStage,
    credentialVerified: Boolean(row.credentialVerified),
    credentialVerificationSource: row.credentialVerificationSource,
    credentialVerificationId: row.credentialVerificationId,
    loanPurpose: row.loanPurpose,
    propertyZip: row.propertyZip,
    propertyState: row.propertyState,
    propertyCity: row.propertyCity,
    purchasePrice: row.purchasePrice,
    downPayment: row.downPayment,
    currentMortgageBalance: row.currentMortgageBalance,
    estimatedHomeValue: row.estimatedHomeValue,
    creditScoreRange: row.creditScoreRange,
    timeline: row.timeline,
    studentLoanBalanceRange: row.studentLoanBalanceRange,
    studentLoanMonthlyPaymentRange: row.studentLoanMonthlyPaymentRange,
    onIdrPlan: row.onIdrPlan,
    employmentStatus: row.employmentStatus,
    hasEmploymentContract: row.hasEmploymentContract,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    phoneType: row.phoneType ?? "unknown",
    ipAddress: row.ipAddress,
    ipFraudScore: row.ipFraudScore,
    userAgent: row.userAgent,
    recaptchaScore: row.recaptchaScore ? Number(row.recaptchaScore) : null,
    trustedformCertUrl: row.trustedformCertUrl,
    jornayaLeadidToken: row.jornayaLeadidToken,
    isDuplicate: Boolean(row.isDuplicate),
    duplicateOfLeadId: row.duplicateOfLeadId,
    matchedProgramCount: row.matchedProgramCount ?? 0,
    totalRevenue: row.totalRevenue ? Number(row.totalRevenue) : null,
  };
}
