import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProfessionLanding } from "@/components/shared/ProfessionLanding";
import { getProfessionBySlug } from "@/lib/constants/professions";
import { listPrograms } from "@/lib/services/programs";

export const metadata: Metadata = {
  title: "Dentist Mortgage Loans",
  description: "Compare dentist mortgage programs for DDS and DMD borrowers with no-PMI and student loan-aware underwriting.",
};

export default async function DentistsPage() {
  const profession = getProfessionBySlug("dentists")!;
  const programs = await listPrograms({ degree: "dds" });
  return (
    <>
      <Header />
      <ProfessionLanding profession={profession} programs={programs} />
      <Footer />
    </>
  );
}
