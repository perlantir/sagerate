export const LOAN_PURPOSES = [
  { value: "purchase", label: "Purchase a Home" },
  { value: "refinance", label: "Refinance" },
  { value: "cashout_refi", label: "Cash-Out Refinance" },
  { value: "heloc", label: "Home Equity (HELOC)" },
] as const;

export const CAREER_STAGES = [
  { value: "resident_fellow", label: "Resident / Fellow" },
  { value: "within_1_year_training", label: "Within 1 Year of Training" },
  { value: "practicing_1_5", label: "Practicing 1-5 Years" },
  { value: "practicing_5_10", label: "Practicing 5-10 Years" },
  { value: "practicing_10_plus", label: "Practicing 10+ Years" },
  { value: "student_with_contract", label: "Student with Signed Contract" },
] as const;
