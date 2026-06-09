import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/admin";

export async function GET() {
  return NextResponse.json({ stats: await getDashboardStats() });
}
