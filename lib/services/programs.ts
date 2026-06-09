import type { CareerStage, LenderProgram, LoanProgramType, LoanPurpose, ProfessionDegree } from "@/lib/types";
import { LENDER_PROGRAMS } from "@/lib/constants/programs";

export type ProgramFilters = {
  programType?: LoanProgramType | string | null;
  degree?: ProfessionDegree | string | null;
  state?: string | null;
  loanAmount?: number | null;
  loanPurpose?: LoanPurpose | string | null;
  downPayment?: string | number | null;
  careerStage?: CareerStage | string | null;
};

export async function listPrograms(filters: ProgramFilters = {}): Promise<LenderProgram[]> {
  return filterPrograms(LENDER_PROGRAMS.filter((program) => program.isActive), filters).sort(
    (a, b) => a.displayOrder - b.displayOrder || (b.maxLoanAmountTotal ?? 0) - (a.maxLoanAmountTotal ?? 0),
  );
}

export function filterPrograms(programs: LenderProgram[], filters: ProgramFilters) {
  return programs.filter((program) => {
    if (filters.programType && filters.programType !== "all" && program.programType !== filters.programType) {
      return false;
    }
    if (filters.degree && filters.degree !== "all" && !program.acceptedDegrees.includes(filters.degree as ProfessionDegree)) {
      return false;
    }
    if (filters.state && filters.state !== "all" && !program.licensedStates.includes(String(filters.state).toUpperCase())) {
      return false;
    }
    if (filters.loanAmount && program.maxLoanAmountTotal && filters.loanAmount > program.maxLoanAmountTotal) {
      return false;
    }
    if (filters.loanPurpose === "refinance" && !program.refinanceAvailable) return false;
    if (filters.loanPurpose === "cashout_refi" && !program.cashOutAvailable) return false;
    if (filters.careerStage === "resident_fellow" && !program.acceptsResidents) return false;
    return true;
  });
}

export async function countMatchedPrograms(filters: ProgramFilters) {
  return (await listPrograms(filters)).length;
}

export async function getProgramById(id: string) {
  return LENDER_PROGRAMS.find((program) => program.id === id) ?? null;
}
