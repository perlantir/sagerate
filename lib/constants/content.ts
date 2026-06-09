export const BLOG_POSTS = [
  {
    slug: "doctor-loan-student-debt",
    title: "How Doctor Mortgage Programs Treat Student Debt",
    description: "A practical guide to IBR payments, deferred loans, and underwriting overlays for physicians and dentists.",
    body: "Professional mortgage programs can treat student debt differently from conventional underwriting. Some use IBR payments, some exclude deferred obligations, and others apply overlays by state or career stage.",
  },
  {
    slug: "zero-down-no-pmi",
    title: "0% Down and No PMI: What Professionals Should Compare",
    description: "Understand how low-down-payment professional mortgage programs differ from standard jumbo loans.",
    body: "The headline benefit is compelling, but the right comparison also includes rate type, reserve requirements, loan amount tiers, and whether a signed employment contract is enough.",
  },
  {
    slug: "attorney-mortgage-options",
    title: "Attorney Mortgage Options After the Bar Exam",
    description: "What new attorneys should know about timing, income documentation, and professional loan eligibility.",
    body: "Attorney-focused mortgage options vary by lender. BigLaw, public interest, and clerkship paths can produce different income documentation challenges.",
  },
] as const;

export const PROFESSION_FAQS: Record<string, Array<[string, string]>> = {
  physicians: [
    ["Can residents see rate options?", "Many physician loan programs accept residents or fellows with a signed employment contract."],
    ["How is student debt handled?", "Several programs use IBR payments or flexible student debt treatment."],
    ["Is PMI required?", "Most featured professional programs waive PMI even with low down payments."],
  ],
  dentists: [
    ["Are DDS and DMD both supported?", "Most dentist programs treat DDS and DMD credentials similarly."],
    ["Can practice owners compare rates?", "Yes, but self-employed underwriting documentation may vary by lender."],
    ["Can dental school debt be managed?", "Programs differ, which is why student loan treatment is tracked in the comparison table."],
  ],
  attorneys: [
    ["Can new associates see rate options?", "Some programs accept employment contracts or offer flexible income documentation for new associates."],
    ["Does bar admission timing matter?", "It can. Lenders may ask for bar status or years since admission."],
    ["Are these jumbo alternatives?", "Often yes, especially in higher-cost markets where professional programs compete with jumbo structures."],
  ],
  veterinarians: [
    ["Are DVM borrowers supported?", "Several professional loan programs include veterinarians, although state availability varies."],
    ["Is practice ownership considered?", "Yes, but private practice income may require additional documentation."],
    ["Are student loans treated flexibly?", "Some lenders account for IDR payments or deferred loans."],
  ],
  cpas: [
    ["Are CPAs eligible?", "A smaller but meaningful set of programs accepts CPAs and finance professionals."],
    ["Do partner distributions count?", "Underwriting varies, but admin-maintained notes can track documentation rules."],
    ["Is zero down available?", "Availability depends on lender, state, loan amount, and credit tier."],
  ],
  other: [
    ["What if my degree is not listed?", "Use the rate finder and select Other so the team can manually surface relevant options."],
    ["Are all states covered?", "The program table tracks state availability and can be filtered by market."],
    ["Does submitting affect credit?", "No. The match form does not run a hard credit pull."],
  ],
};
