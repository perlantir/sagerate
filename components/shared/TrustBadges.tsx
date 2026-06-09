import { BadgeCheck, LockKeyhole, ShieldCheck, Users } from "lucide-react";

export function TrustBadges() {
  const items = [
    { icon: Users, label: "25+ Lender Programs" },
    { icon: BadgeCheck, label: "Credential-Verified Leads" },
    { icon: ShieldCheck, label: "100% Free to Compare" },
    { icon: LockKeyhole, label: "SSL Secure" },
  ];

  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3 text-sm font-semibold text-navy">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold/12 text-gold">
            <item.icon size={18} />
          </span>
          {item.label}
        </div>
      ))}
    </div>
  );
}
