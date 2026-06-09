import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProfessionLanding } from "@/components/shared/ProfessionLanding";
import { getProfessionBySlug } from "@/lib/constants/professions";
import { listPrograms } from "@/lib/services/programs";

export const metadata: Metadata = {
  title: "CPA and Finance Professional Mortgage Loans",
  description: "Compare professional mortgage programs for CPAs, CFAs, and finance professionals.",
};

export default async function CPAsPage() {
  const profession = getProfessionBySlug("cpas")!;
  const programs = await listPrograms({ degree: "cpa" });
  return (
    <>
      <Header />
      <ProfessionLanding profession={profession} programs={programs} />
      <Footer />
    </>
  );
}
