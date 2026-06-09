import Link from "next/link";
import { PROFESSIONS } from "@/lib/constants/professions";
import { STATES } from "@/lib/constants/states";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-navy text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.1fr_3fr]">
        <div>
          <div className="text-lg font-bold">ProLoanMatch</div>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/72">
            A comparison marketplace for professional mortgage programs. ProLoanMatch is not a lender and does not make credit decisions.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-4">
          <FooterColumn title="Professions" links={PROFESSIONS.map((item) => ({ href: `/professions/${item.slug}`, label: item.title }))} />
          <FooterColumn
            title="States"
            links={[
              ...STATES.slice(0, 10).map((item) => ({ href: `/states/${item.slug}`, label: item.name })),
              { href: "/compare", label: "All States" },
            ]}
          />
          <FooterColumn
            title="Resources"
            links={[
              { href: "/blog", label: "Blog" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/compare", label: "Program Table" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { href: "/about", label: "About" },
              { href: "/privacy", label: "Privacy" },
              { href: "/terms", label: "Terms" },
              { href: "/admin", label: "Admin" },
            ]}
          />
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="container-page flex flex-col gap-2 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} ProLoanMatch. All rights reserved.</p>
          <p>NMLS disclosure placeholder. Offers are subject to lender underwriting and program availability.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <div>
      <div className="mb-3 text-sm font-bold text-white">{title}</div>
      <div className="grid gap-2">
        {links.map((link) => (
          <Link key={`${link.href}-${link.label}`} href={link.href} className="text-sm text-white/70 transition hover:text-white">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
