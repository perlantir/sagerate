import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Suspense } from "react";
import { Landmark } from "lucide-react";
import { MultiStepForm } from "@/components/form/MultiStepForm";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Get Professional Mortgage Rate Options",
  description: "Answer a guided rate finder and get matched with professional mortgage rate options.",
};

export default function GetRatesPage() {
  return (
    <>
      {process.env.NEXT_PUBLIC_TRUSTEDFORM_SCRIPT_URL ? <Script src={process.env.NEXT_PUBLIC_TRUSTEDFORM_SCRIPT_URL} strategy="afterInteractive" /> : null}
      {process.env.NEXT_PUBLIC_JORNAYA_CAMPAIGN_KEY ? (
        <Script id="jornaya-config" strategy="afterInteractive">{`window.LeadiD = window.LeadiD || {}; window.LeadiD.campaign_key = "${process.env.NEXT_PUBLIC_JORNAYA_CAMPAIGN_KEY}";`}</Script>
      ) : null}
      <main className="min-h-screen bg-surface py-6">
        <div className="container-page max-w-[1240px]">
          <div className="mb-5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-navy">
              <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-gold/40 bg-white text-gold">
                <Landmark size={18} />
              </span>
              <span className="text-lg font-semibold">ProLoanMatch</span>
            </Link>
            <Link href="/" className="text-sm font-semibold text-navy">
              Save & Exit
            </Link>
          </div>
          <Suspense fallback={<div className="rounded-lg bg-white p-8 text-navy shadow-sm">Loading rate finder...</div>}>
            <MultiStepForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
