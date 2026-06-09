import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = { title: "Privacy Policy", description: "ProLoanMatch privacy policy." };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-surface py-16">
        <article className="container-page max-w-3xl rounded-lg bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-navy">Privacy Policy</h1>
          <p className="mt-4 leading-7 text-slate-600">
            ProLoanMatch collects submitted contact, professional, loan, source, and consent information to match visitors with professional mortgage programs.
            Data is transmitted over TLS and stored through configured Supabase infrastructure.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
