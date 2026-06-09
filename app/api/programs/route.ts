import { NextResponse } from "next/server";
import { listPrograms } from "@/lib/services/programs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const programs = await listPrograms({
    degree: url.searchParams.get("degree"),
    state: url.searchParams.get("state"),
    loanAmount: url.searchParams.get("loanAmount") ? Number(url.searchParams.get("loanAmount")) : null,
    loanPurpose: url.searchParams.get("loanPurpose"),
    downPayment: url.searchParams.get("downPayment"),
    careerStage: url.searchParams.get("careerStage"),
  });

  return NextResponse.json(
    { programs },
    {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
