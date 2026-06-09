import Link from "next/link";
import { Landmark } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

const nav = [
  { href: "/compare", label: "Compare Loan Programs" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/professions/physicians", label: "For Professionals" },
  { href: "/blog", label: "Resources" },
  { href: "/about", label: "About Us" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="gold-focus flex items-center gap-2 rounded-md text-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-gold/40 bg-white text-gold">
            <Landmark size={19} />
          </span>
          <span className="text-lg font-semibold tracking-tight">ProLoanMatch</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-slate-600 transition hover:text-navy">
              {item.label}
            </Link>
          ))}
        </nav>
        <LinkButton href="/get-rates" variant="gold" size="sm" className="hidden sm:inline-flex">
          Get Started
        </LinkButton>
      </div>
    </header>
  );
}
