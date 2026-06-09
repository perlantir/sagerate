import Link from "next/link";

export function TableEmptyState({ reason = "filters" }: { reason?: "filters" | "rates" }) {
  const isRateLimited = reason === "rates";
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-xl font-bold text-navy">{isRateLimited ? "No scraped program rates are available yet." : "No programs match your current filters."}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">
        {isRateLimited ? (
          "Lenders will appear here only after the scraper finds a published professional or physician/doctor loan rate for that program."
        ) : (
          <>
            Try adjusting your criteria or{" "}
            <Link href="/get-rates" className="font-bold text-gold">
              Get My Rate Options
            </Link>{" "}
            for a guided rate match.
          </>
        )}
      </p>
    </div>
  );
}
