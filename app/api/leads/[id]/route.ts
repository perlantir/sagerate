import { NextResponse } from "next/server";
import { z } from "zod";
import { getLead, updateLeadStatus } from "@/lib/services/leads";

const paramsSchema = z.object({ id: z.string() });
const updateSchema = z.object({
  status: z.enum(["new", "verified", "credential_verified", "distributed", "sold", "rejected", "returned"]),
});

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const params = paramsSchema.parse(await context.params);
  const lead = await getLead(params.id);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = paramsSchema.parse(await context.params);
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid status." }, { status: 422 });
  const lead = await updateLeadStatus(params.id, parsed.data.status);
  if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  return NextResponse.json({ lead });
}
