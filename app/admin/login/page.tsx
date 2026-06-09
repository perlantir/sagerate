import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = { title: "Admin Login", description: "Admin login for ProLoanMatch." };

export default function AdminLoginPage() {
  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center p-5">
      <form className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-navy">Admin login</h1>
        <p className="mt-2 text-sm text-slate-600">Supabase Auth signs in configured admin users. Demo mode is active when Supabase env vars are absent.</p>
        <div className="mt-5 grid gap-4">
          <div>
            <Label>Email</Label>
            <Input type="email" defaultValue={process.env.ADMIN_EMAIL ?? ""} />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" defaultValue="" />
          </div>
          <Button type="button" variant="gold">
            Sign In
          </Button>
        </div>
      </form>
    </main>
  );
}
