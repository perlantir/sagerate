import type { ProfessionDegree } from "@/lib/types";

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
  { value: "md", label: "MD", fullTitle: "Doctor of Medicine" },
  { value: "do", label: "DO", fullTitle: "Doctor of Osteopathic Medicine" },
  { value: "dds", label: "DDS", fullTitle: "Doctor of Dental Surgery" },
  { value: "dmd", label: "DMD", fullTitle: "Doctor of Dental Medicine" },
  { value: "dpm", label: "DPM", fullTitle: "Doctor of Podiatric Medicine" },
  { value: "dvm", label: "DVM", fullTitle: "Doctor of Veterinary Medicine" },
  { value: "jd", label: "JD", fullTitle: "Juris Doctor" },
  { value: "cpa", label: "CPA", fullTitle: "Certified Public Accountant" },
  { value: "pharmd", label: "PharmD", fullTitle: "Doctor of Pharmacy" },
  { value: "pa", label: "PA", fullTitle: "Physician Assistant" },
  { value: "np", label: "NP", fullTitle: "Nurse Practitioner" },
  { value: "crna", label: "CRNA", fullTitle: "Nurse Anesthetist" },
  { value: "other", label: "Other", fullTitle: "Other Advanced Degree" },
];

export function getProfessionBySlug(slug: string) {
  return PROFESSIONS.find((profession) => profession.slug === slug);
}

export function getDegreeLabel(degree?: string | null) {
  return DEGREE_OPTIONS.find((option) => option.value === degree)?.label ?? "Professional";
}
