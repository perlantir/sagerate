export function AdminHeader({ email, mode }: { email?: string | null; mode?: "demo" | "supabase" }) {
  return (
    <header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
      <div>
        <p className="text-sm font-semibold text-slate-500">Internal dashboard</p>
        <h1 className="text-xl font-bold text-navy">Rate operations</h1>
      </div>
      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
        {mode === "demo" ? "Demo mode" : email}
      </div>
    </header>
  );
}
