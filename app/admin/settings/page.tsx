import type { Metadata } from "next";
import { requireAdmin } from "@/lib/services/auth";

export const metadata: Metadata = { title: "Settings", description: "Admin account and platform settings." };

export default async function AdminSettingsPage() {
  await requireAdmin();
  return (
    <main className="grid gap-5 p-5">
      <div>
        <h1 className="text-3xl font-bold text-navy">Settings</h1>
        <p className="mt-1 text-slate-600">Admin account settings and integration status.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Supabase", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Configured" : "Demo fallback active"],
          ["Resend", process.env.RESEND_API_KEY ? "Configured" : "Optional"],
          ["Upstash Redis", process.env.UPSTASH_REDIS_REST_URL ? "Configured" : "Local limiter active"],
          ["reCAPTCHA", process.env.RECAPTCHA_SECRET_KEY ? "Configured" : "Optional"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm font-semibold text-slate-500">{label}</div>
            <div className="mt-2 text-xl font-bold text-navy">{value}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
