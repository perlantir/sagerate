import type { LoanProgramType, ProfessionDegree } from "@/lib/types";

export const PROFESSIONS: Array<{
  degree: ProfessionDegree;
  label: string;
  title: string;
  slug: string;
  category: string;
  icon: string;
  hero: string;
  subheadline: string;
}> = [
  {
    degree: "md",
    label: "MD",
    title: "Physicians & Surgeons",
    slug: "physicians",
    category: "Medical",
    icon: "stethoscope",
    hero: "Physician Mortgage Loans Built Around Training, Contracts, and Student Debt",
    subheadline:
      "Compare doctor loan programs that understand residency, fellowship, relocation, and complex student loan profiles.",
  },
  {
    degree: "dds",
    label: "DDS/DMD",
    title: "Dentists",
    slug: "dentists",
    category: "Dental",
    icon: "tooth",
    hero: "Dental Professional Mortgage Programs Without the Standard PMI Tradeoffs",
    subheadline:
      "Find programs for DDS and DMD borrowers navigating dental school debt, practice ownership, and home financing.",
  },
  {
    degree: "jd",
    label: "JD",
    title: "Attorneys",
    slug: "attorneys",
    category: "Legal",
    icon: "scale",
    hero: "Attorney Mortgage Options for New Associates and Established Counsel",
    subheadline:
      "Compare professional mortgage programs that factor in bar timing, firm income, public sector work, and jumbo alternatives.",
  },
  {
    degree: "dvm",
    label: "DVM",
    title: "Veterinarians",
    slug: "veterinarians",
    category: "Veterinary",
    icon: "paw",
    hero: "Veterinarian Mortgage Programs That Account for Real Professional Debt",
    subheadline:
      "Explore low-down-payment programs for veterinarians with flexible underwriting around student loans and practice stages.",
  },
  {
    degree: "cpa",
    label: "CPA/CFA",
    title: "CPAs & Finance",
    slug: "cpas",
    category: "Finance",
    icon: "chart",
    hero: "Professional Mortgage Comparisons for CPAs and Finance Leaders",
    subheadline:
      "Match with lenders that serve credentialed finance professionals, partners, and rising advisory leaders.",
  },
  {
    degree: "other",
    label: "Other",
    title: "Other Professionals",
    slug: "other",
    category: "Professional",
    icon: "briefcase",
    hero: "Mortgage Matches for Advanced-Degree Professionals",
    subheadline:
      "Tell us about your credentials and goals, and we will identify programs that fit your career path.",
  },
];

export const DEGREE_OPTIONS: Array<{ value: ProfessionDegree; label: string; fullTitle: string }> = [
  { value: "medical_resident", label: "Medical Resident", fullTitle: "Medical Resident (Educational License)" },
  { value: "md", label: "MD", fullTitle: "Doctor of Medicine" },
  { value: "dds", label: "DDS", fullTitle: "Doctor of Dental Surgery" },
  { value: "dmd", label: "DMD", fullTitle: "Doctor of Dental Medicine" },
  { value: "od", label: "OD", fullTitle: "Doctor of Optometry" },
  { value: "ophthalmologist_md", label: "Ophthalmologist (MD)", fullTitle: "Doctor of Ophthalmology" },
  { value: "pharmd", label: "PharmD", fullTitle: "Doctor of Pharmacy" },
  { value: "dpm", label: "DPM", fullTitle: "Doctor of Podiatric Medicine" },
  { value: "do", label: "DO", fullTitle: "Doctor of Osteopathy" },
  { value: "pa", label: "PA", fullTitle: "Physician Assistant" },
  { value: "rn", label: "RN", fullTitle: "Registered Nurse" },
  { value: "crna", label: "CRNA", fullTitle: "Nurse Anesthetist" },
  { value: "np", label: "NP", fullTitle: "Nurse Practitioner" },
  { value: "cns", label: "CNS", fullTitle: "Clinical Nurse Specialist" },
  { value: "atp_pilot", label: "ATP Pilot", fullTitle: "Airline Transport Pilot" },
  { value: "cpa", label: "CPA", fullTitle: "Certified Public Accountant" },
  { value: "jd", label: "Attorney", fullTitle: "Attorney" },
  { value: "dvm", label: "DVM", fullTitle: "Doctor of Veterinary Medicine" },
  { value: "other", label: "Other", fullTitle: "Other Advanced Degree" },
];

export const PROFESSIONAL_LOAN_DEGREES: ProfessionDegree[] = [
  "medical_resident",
  "md",
  "dds",
  "dmd",
  "od",
  "ophthalmologist_md",
  "pharmd",
  "dpm",
  "do",
  "pa",
  "rn",
  "crna",
  "np",
  "cns",
  "atp_pilot",
  "cpa",
  "jd",
  "dvm",
];

export const PHYSICIAN_DOCTOR_LOAN_DEGREES: ProfessionDegree[] = [
  "md",
  "dpm",
  "do",
  "dds",
  "dmd",
  "dvm",
  "ophthalmologist_md",
  "od",
];

export const LOAN_PROGRAM_TYPES: Array<{
  value: LoanProgramType;
  label: string;
  description: string;
  eligibleDegrees: ProfessionDegree[];
}> = [
  {
    value: "professional",
    label: "Professional Loans",
    description: "For medical residents, medical and dental professionals, nurses, ATP pilots, CPAs, attorneys, veterinarians, and related licensed professionals.",
    eligibleDegrees: PROFESSIONAL_LOAN_DEGREES,
  },
  {
    value: "physician_doctor",
    label: "Physician / Doctor Loans",
    description: "For MD, DO, DPM, DDS, DMD, DVM, OD, and ophthalmologist borrowers. Psychiatrists must be licensed.",
    eligibleDegrees: PHYSICIAN_DOCTOR_LOAN_DEGREES,
  },
];

export function getProfessionBySlug(slug: string) {
  return PROFESSIONS.find((profession) => profession.slug === slug);
}

export function getDegreeLabel(degree?: string | null) {
  return DEGREE_OPTIONS.find((option) => option.value === degree)?.label ?? "Professional";
}

export function getLoanProgramTypeLabel(type?: string | null) {
  return LOAN_PROGRAM_TYPES.find((option) => option.value === type)?.label ?? "Professional Loans";
}

export function getEligibleDegreeOptions(type?: string | null) {
  const selected = LOAN_PROGRAM_TYPES.find((option) => option.value === type);
  const eligible = selected?.eligibleDegrees ?? PROFESSIONAL_LOAN_DEGREES;
  return DEGREE_OPTIONS.filter((option) => eligible.includes(option.value));
}

export function summarizeDegrees(degrees: ProfessionDegree[], limit = 4) {
  const labels = degrees.map((degree) => getDegreeLabel(degree));
  if (labels.length <= limit) return labels.join(", ");
  return `${labels.slice(0, limit).join(", ")} +${labels.length - limit} more`;
}
