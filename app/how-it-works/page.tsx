import type { Metadata } from "next";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = { title: "How It Works", description: "How ProLoanMatch compares professional mortgage programs and matches borrowers." };

export default function HowItWorksPage() {
  return (
    <>
      <Header />
      <section className="bg-navy py-14 text-white">
        <div className="container-page">
          <h1 className="font-serif text-4xl font-bold">How ProLoanMatch works</h1>
          <p className="mt-4 max-w-2xl text-white/75">Compare programs first or complete the guided intake to receive lender matches.</p>
        </div>
      </section>
      <HowItWorks />
      <Footer />
    </>
  );
}
