import { NextResponse } from "next/server";
import { validateEmail } from "@/lib/validation/email";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string };
  const result = await validateEmail(body.email ?? "");
  return NextResponse.json(result);
}
