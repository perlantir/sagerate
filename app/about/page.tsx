import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = { title: "About", description: "About ProLoanMatch and its professional mortgage marketplace." };

export default function AboutPage() {
  return <SimplePage title="About ProLoanMatch" body="ProLoanMatch helps advanced-degree professionals compare specialized mortgage programs by credential, career stage, state, and underwriting features." />;
}

function SimplePage({ title, body }: { title: string; body: string }) {
  return (
    <>
      <Header />
      <main className="bg-surface py-16">
        <div className="container-page max-w-3xl rounded-lg bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-bold text-navy">{title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{body}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
