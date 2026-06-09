import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProfessionLanding } from "@/components/shared/ProfessionLanding";
import { getProfessionBySlug } from "@/lib/constants/professions";
import { listPrograms } from "@/lib/services/programs";

export const metadata: Metadata = {
  title: "Physician Mortgage Loans",
  description: "Compare physician mortgage programs for MD and DO borrowers with resident-friendly underwriting and student debt flexibility.",
};

export default async function PhysiciansPage() {
  const profession = getProfessionBySlug("physicians")!;
  const programs = await listPrograms({ degree: "md" });
  return (
    <>
      <Header />
      <ProfessionLanding profession={profession} programs={programs} />
      <Footer />
    </>
  );
}
