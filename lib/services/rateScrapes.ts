import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { mortgageRateScrapeRuns, mortgageRateSnapshots, mortgageRateSources } from "@/lib/db/schema";
import { getConfiguredRateSources } from "@/lib/rates/sources";
import type { ExtractedRateQuote, RateScrapeMethod, RateScrapeStatus, RateScrapeTrigger, RateSourceRecord, RateSourceSeed } from "@/lib/rates/types";
import type { ComparableRateSnapshot } from "@/lib/types";

export async function ensureDefaultRateSources() {
  const db = getDb();
  const seeds = getConfiguredRateSources();
  if (!db) {
    return seeds.map((seed) => ({ ...seed, id: `seed-${seed.programSlug}`, isActive: true }));
  }

  const existing = await db.select().from(mortgageRateSources);
  const existingProgramSlugs = new Set(existing.map((source) => source.programSlug));
  const missing = seeds.filter((seed) => !existingProgramSlugs.has(seed.programSlug));
  const existingByProgramSlug = new Map(existing.map((source) => [source.programSlug, source]));

  for (const seed of seeds) {
    const existingSource = existingByProgramSlug.get(seed.programSlug);
    if (!existingSource) continue;
    if (
      existingSource.sourceUrl !== seed.sourceUrl ||
      existingSource.scrapeMethod !== seed.scrapeMethod ||
      JSON.stringify(existingSource.selectorHints ?? {}) !== JSON.stringify(seed.selectorHints ?? {}) ||
      existingSource.notes !== (seed.notes ?? null)
    ) {
      await db
        .update(mortgageRateSources)
        .set({
          updatedAt: new Date(),
          lenderName: seed.lenderName,
          programName: seed.programName ?? null,
          programType: seed.programType,
          sourceUrl: seed.sourceUrl,
          scrapeMethod: seed.scrapeMethod,
          selectorHints: seed.selectorHints ?? {},
          notes: seed.notes ?? null,
          isActive: true,
        })
        .where(eq(mortgageRateSources.programSlug, seed.programSlug));
    }
  }

  if (missing.length) {
    await db.insert(mortgageRateSources).values(
      missing.map((seed) => ({
        programSlug: seed.programSlug,
        lenderName: seed.lenderName,
        programName: seed.programName ?? null,
        programType: seed.programType,
        sourceUrl: seed.sourceUrl,
        scrapeMethod: seed.scrapeMethod,
        selectorHints: seed.selectorHints ?? {},
        notes: seed.notes ?? null,
      })),
    );
  }

  return listActiveRateSources();
}

export async function listActiveRateSources(): Promise<RateSourceRecord[]> {
  const db = getDb();
  if (!db) {
    return getConfiguredRateSources().map((source) => ({ ...source, id: `seed-${source.programSlug}`, isActive: true }));
  }

  const rows = await db.select().from(mortgageRateSources).where(eq(mortgageRateSources.isActive, true)).orderBy(mortgageRateSources.lenderName);
  return rows.map((row) => ({
    id: row.id,
    programSlug: row.programSlug,
    lenderName: row.lenderName,
    programName: row.programName,
    programType: row.programType,
    sourceUrl: row.sourceUrl,
    scrapeMethod: row.scrapeMethod,
    selectorHints: row.selectorHints ?? {},
    notes: row.notes,
    isActive: row.isActive,
  }));
}

export async function createRateScrapeRun({
  trigger,
  mode,
  totalSources,
}: {
  trigger: RateScrapeTrigger;
  mode: RateScrapeMethod;
  totalSources: number;
}) {
  const db = getDb();
  if (!db) return null;
  const [row] = await db
    .insert(mortgageRateScrapeRuns)
    .values({
      startedAt: new Date(),
      trigger,
      mode,
      totalSources,
      status: "running",
    })
    .returning();
  return row;
}

export async function finishRateScrapeRun({
  runId,
  successfulSources,
  failedSources,
  notes,
}: {
  runId?: string | null;
  successfulSources: number;
  failedSources: number;
  notes?: string;
}) {
  const db = getDb();
  if (!db || !runId) return null;
  const status = failedSources === 0 ? "success" : successfulSources > 0 ? "partial" : "error";
  const [row] = await db
    .update(mortgageRateScrapeRuns)
    .set({
      finishedAt: new Date(),
      status,
      successfulSources,
      failedSources,
      notes,
    })
    .where(eq(mortgageRateScrapeRuns.id, runId))
    .returning();
  return row;
}

export async function recordRateSnapshot({
  runId,
  source,
  status,
  quote,
  rawText,
  errorMessage,
  metadata,
}: {
  runId?: string | null;
  source: RateSourceRecord | RateSourceSeed;
  status: RateScrapeStatus;
  quote?: ExtractedRateQuote | null;
  rawText?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}) {
  const db = getDb();
  if (!db) return null;

  const [row] = await db
    .insert(mortgageRateSnapshots)
    .values({
      runId: runId ?? null,
      sourceId: "id" in source && source.id && !source.id.startsWith("seed-") ? source.id : null,
      programSlug: source.programSlug,
      lenderName: source.lenderName,
      programName: source.programName ?? null,
      programType: source.programType,
      sourceUrl: source.sourceUrl,
      loanProduct: quote?.loanProduct ?? null,
      interestRate: toNumeric(quote?.interestRate),
      apr: toNumeric(quote?.apr),
      points: toNumeric(quote?.points),
      monthlyPayment: quote?.monthlyPayment ? Math.round(quote.monthlyPayment) : null,
      closingFees: quote?.closingFees ? Math.round(quote.closingFees) : null,
      lenderFees: quote?.lenderFees ? Math.round(quote.lenderFees) : null,
      thirdPartyFees: quote?.thirdPartyFees ? Math.round(quote.thirdPartyFees) : null,
      status,
      confidence: toNumeric(quote?.confidence),
      rawText: quote?.rawText ?? rawText?.slice(0, 6000) ?? null,
      errorMessage: errorMessage ?? null,
      metadata: {
        ...(metadata ?? {}),
        ...(quote?.metadata ?? {}),
      },
    })
    .returning();
  return row;
}

export async function listLatestRateSnapshots(limit = 100) {
  const db = getDb();
  if (!db) return [];
  return db.select().from(mortgageRateSnapshots).orderBy(desc(mortgageRateSnapshots.scrapedAt)).limit(limit);
}

export async function listLatestComparableRateSnapshots(limit = 300): Promise<Record<string, ComparableRateSnapshot[]>> {
  const db = getDb();
  if (!db) return {};
  const [latestRun] = await db.select().from(mortgageRateScrapeRuns).orderBy(desc(mortgageRateScrapeRuns.createdAt)).limit(1);
  const rows = latestRun
    ? await db.select().from(mortgageRateSnapshots).where(eq(mortgageRateSnapshots.runId, latestRun.id)).orderBy(desc(mortgageRateSnapshots.scrapedAt)).limit(limit)
    : await db.select().from(mortgageRateSnapshots).orderBy(desc(mortgageRateSnapshots.scrapedAt)).limit(limit);
  const latest: Record<string, ComparableRateSnapshot[]> = {};
  const seen = new Set<string>();

  const rowsByConfidence = [...rows].sort((a, b) => (toNumber(b.confidence) ?? 0) - (toNumber(a.confidence) ?? 0));

  for (const row of rowsByConfidence) {
    if (row.status !== "success") continue;
    if (!row.interestRate || !row.apr) continue;
    const metadata = row.metadata ?? {};
    const sourceKind = typeof metadata.sourceKind === "string" ? metadata.sourceKind : null;
    if (sourceKind !== "professional_program" && sourceKind !== "doctor_program") continue;

    const key = `${row.programSlug}:${row.loanProduct ?? "program"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    latest[row.programSlug] ??= [];
    latest[row.programSlug].push({
      id: row.id,
      programSlug: row.programSlug,
      lenderName: row.lenderName,
      programName: row.programName,
      programType: row.programType,
      sourceUrl: row.sourceUrl,
      loanProduct: row.loanProduct,
      interestRate: toNumber(row.interestRate),
      apr: toNumber(row.apr),
      points: toNumber(row.points),
      monthlyPayment: row.monthlyPayment,
      closingFees: row.closingFees,
      lenderFees: row.lenderFees,
      thirdPartyFees: row.thirdPartyFees,
      scrapedAt: row.scrapedAt.toISOString(),
      confidence: toNumber(row.confidence),
      sourceKind,
      asOf: typeof metadata.asOf === "string" ? metadata.asOf : null,
    });
  }

  return latest;
}

function toNumeric(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : null;
}

function toNumber(value: string | number | null | undefined) {
  if (typeof value === "number") return value;
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
