import Link from "next/link";
import { BarChart3, Gauge, Landmark, Settings, TableProperties, Users } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: Gauge },
  { href: "/admin/leads", label: "Leads", icon: TableProperties },
  { href: "/admin/buyers", label: "Buyers", icon: Users },
  { href: "/admin/programs", label: "Programs", icon: Landmark },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-200 bg-navy p-4 text-white lg:block">
      <Link href="/" className="mb-8 flex items-center gap-2 rounded-md text-lg font-bold">
        <Landmark size={22} />
        ProLoanMatch
      </Link>
      <nav className="grid gap-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-white/72 transition hover:bg-white/10 hover:text-white">
            <link.icon size={17} />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
