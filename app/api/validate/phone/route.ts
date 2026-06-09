import { NextResponse } from "next/server";
import { validatePhone } from "@/lib/validation/phone";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { phone?: string };
  const result = await validatePhone(body.phone ?? "");
  return NextResponse.json(result);
}
