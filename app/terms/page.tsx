import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = { title: "Terms of Service", description: "ProLoanMatch terms of service." };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="bg-surface py-16">
        <article className="container-page max-w-3xl rounded-lg bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-navy">Terms of Service</h1>
          <p className="mt-4 leading-7 text-slate-600">
            ProLoanMatch is a marketplace and lead matching platform, not a lender. Program data is informational and subject to lender verification, eligibility,
            underwriting, and state availability.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
