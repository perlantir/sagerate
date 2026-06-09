import { config } from "dotenv";
import { closeDb, getDb } from "@/lib/db";
import { lenderPrograms } from "@/lib/db/schema";
import { LENDER_PROGRAMS } from "@/lib/constants/programs";

config({ path: ".env.local" });
config();

async function main() {
  const db = getDb();
  if (!db) {
    console.log("DATABASE_URL is not configured. Seed preview:");
    console.table(LENDER_PROGRAMS.map((program) => ({ lender: program.lenderName, states: program.licensedStates.length })));
    return;
  }

  await db.delete(lenderPrograms);
  await db.insert(lenderPrograms).values(
    LENDER_PROGRAMS.map((program) => ({
      programType: program.programType,
      lenderName: program.lenderName,
      programName: program.programName,
      acceptedDegrees: program.acceptedDegrees,
      acceptsResidents: program.acceptsResidents,
      yearsFromTrainingMax: program.yearsFromTrainingMax,
      maxLoanAmountZeroDown: program.maxLoanAmountZeroDown,
      maxLoanAmount5Down: program.maxLoanAmount5Down,
      maxLoanAmount10Down: program.maxLoanAmount10Down,
      maxLoanAmountTotal: program.maxLoanAmountTotal,
      pmiRequired: program.pmiRequired,
      rateTypesAvailable: program.rateTypesAvailable,
      studentLoanTreatment: program.studentLoanTreatment,
      licensedStates: program.licensedStates,
      requiresEmploymentContract: program.requiresEmploymentContract,
      refinanceAvailable: program.refinanceAvailable,
      cashOutAvailable: program.cashOutAvailable,
      fixedRateEstimate: program.fixedRateEstimate ? String(program.fixedRateEstimate) : null,
      armRateEstimate: program.armRateEstimate ? String(program.armRateEstimate) : null,
      lenderWebsiteUrl: program.lenderWebsiteUrl,
      programNotes: program.programNotes,
      isActive: program.isActive,
      lastVerified: program.lastVerified,
      displayOrder: program.displayOrder,
    })),
  );

  console.log(`Seeded ${LENDER_PROGRAMS.length} lender programs.`);
  console.log("Create the default admin user in Supabase Auth using ADMIN_EMAIL and ADMIN_PASSWORD from your environment.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDb();
  });
