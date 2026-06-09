import { NextResponse } from "next/server";
import { listBuyers } from "@/lib/services/admin";

export async function GET() {
  return NextResponse.json({ buyers: await listBuyers() });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ buyer: { id: crypto.randomUUID(), ...body }, mode: "demo" }, { status: 201 });
}
