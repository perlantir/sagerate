import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProfessionLanding } from "@/components/shared/ProfessionLanding";
import { getProfessionBySlug } from "@/lib/constants/professions";
import { listPrograms } from "@/lib/services/programs";

export const metadata: Metadata = {
  title: "Attorney Mortgage Loans",
  description: "Compare professional mortgage programs for attorneys, new associates, and established legal professionals.",
};

export default async function AttorneysPage() {
  const profession = getProfessionBySlug("attorneys")!;
  const programs = await listPrograms({ degree: "jd" });
  return (
    <>
      <Header />
      <ProfessionLanding profession={profession} programs={programs} />
      <Footer />
    </>
  );
}
