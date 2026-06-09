import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProfessionLanding } from "@/components/shared/ProfessionLanding";
import { getProfessionBySlug } from "@/lib/constants/professions";
import { listPrograms } from "@/lib/services/programs";

export const metadata: Metadata = {
  title: "Veterinarian Mortgage Loans",
  description: "Compare veterinarian mortgage programs for DVM borrowers with flexible student debt and low-down-payment options.",
};

export default async function VeterinariansPage() {
  const profession = getProfessionBySlug("veterinarians")!;
  const programs = await listPrograms({ degree: "dvm" });
  return (
    <>
      <Header />
      <ProfessionLanding profession={profession} programs={programs} />
      <Footer />
    </>
  );
}
