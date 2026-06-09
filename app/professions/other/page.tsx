import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProfessionLanding } from "@/components/shared/ProfessionLanding";
import { getProfessionBySlug } from "@/lib/constants/professions";
import { listPrograms } from "@/lib/services/programs";

export const metadata: Metadata = {
  title: "Mortgage Programs for Other Professionals",
  description: "Find professional mortgage options for advanced-degree borrowers outside the most common credential categories.",
};

export default async function OtherProfessionalsPage() {
  const profession = getProfessionBySlug("other")!;
  const programs = await listPrograms({ degree: "other" });
  return (
    <>
      <Header />
      <ProfessionLanding profession={profession} programs={programs} />
      <Footer />
    </>
  );
}
