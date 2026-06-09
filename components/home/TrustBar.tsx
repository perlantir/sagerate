import { TrustBadges } from "@/components/shared/TrustBadges";

export function TrustBar() {
  return (
    <section className="bg-white py-12">
      <div className="container-page">
        <TrustBadges />
        <p className="mt-5 text-center text-sm font-semibold text-slate-600">Trusted by physicians, attorneys, and professionals nationwide</p>
      </div>
    </section>
  );
}
