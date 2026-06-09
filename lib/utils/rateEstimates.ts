import type { LenderProgram } from "@/lib/types";

export type RateEstimateContext = {
  purchasePrice?: string | number | null;
  downPaymentAmount?: string | number | null;
  loanPurpose?: string | null;
  loanTerm?: string | null;
  creditScore?: string | null;
};

export function estimateProgramRate(program: LenderProgram, context: RateEstimateContext = {}) {
  const loanAmount = getEstimatedLoanAmount(context);
  const termYears = getLoanTermYears(context.loanTerm);
  const payments = termYears * 12;
  const interestRate = getInterestRate(program, context);
  const monthlyInterest = interestRate / 100 / 12;
  const monthlyPayment =
    monthlyInterest > 0 ? Math.round((loanAmount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -payments))) : Math.round(loanAmount / payments);
  const points = Number((0.74 + (program.displayOrder % 5) * 0.19).toFixed(3));
  const upfrontCosts = Math.round(loanAmount * (0.0105 + points / 100) + 1850 + program.displayOrder * 80);
  const lenderFees = Math.round(loanAmount * 0.004 + 995);
  const thirdPartyFees = Math.max(0, upfrontCosts - lenderFees);
  const apr = Number((interestRate + 0.15 + points * 0.035).toFixed(3));
  const eightYearCost = Math.round(monthlyPayment * 96 + upfrontCosts);

  return {
    apr,
    eightYearCost,
    interestRate,
    lenderFees,
    loanAmount,
    monthlyPayment,
    points,
    termLabel: getLoanTermLabel(context.loanTerm),
    thirdPartyFees,
    upfrontCosts,
  };
}

export function getEstimatedLoanAmount(context: RateEstimateContext = {}) {
  const purchasePrice = parseNumber(context.purchasePrice) || 400000;
  const downPayment = parseNumber(context.downPaymentAmount);
  return Math.max(50000, purchasePrice - (downPayment || Math.round(purchasePrice * 0.2)));
}

export function formatRate(value: number) {
  return `${value.toFixed(3)}%`;
}

function getInterestRate(program: LenderProgram, context: RateEstimateContext) {
  let rate = program.fixedRateEstimate ?? 5.68 + (program.displayOrder % 7) * 0.075;
  if (program.programType === "professional") rate += 0.12;

  switch (context.loanTerm) {
    case "20yr":
      rate -= 0.1;
      break;
    case "15yr":
      rate -= 0.42;
      break;
    case "5-1arm":
      rate -= 0.24;
      break;
  }

  if (context.loanPurpose === "refinance") rate += 0.08;
  if (context.loanPurpose === "cashout_refi") rate += 0.25;

  const score = parseNumber(context.creditScore);
  if (score && score < 680) rate += 0.42;
  else if (score && score < 720) rate += 0.22;
  else if (score && score < 740) rate += 0.1;

  return Number(rate.toFixed(3));
}

function getLoanTermYears(term?: string | null) {
  if (term === "20yr") return 20;
  if (term === "15yr") return 15;
  return 30;
}

function getLoanTermLabel(term?: string | null) {
  if (term === "20yr") return "20 year fixed";
  if (term === "15yr") return "15 year fixed";
  if (term === "5-1arm") return "5 year ARM";
  return "30 year fixed";
}

function parseNumber(value?: string | number | null) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(String(value).replace(/[^\d.]/g, "")) || 0;
}
