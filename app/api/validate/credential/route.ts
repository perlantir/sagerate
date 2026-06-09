import { NextResponse } from "next/server";
import { z } from "zod";
import { professionDegreeSchema } from "@/lib/schemas/lead";
import { verifyCredential } from "@/lib/validation/credential";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  state: z.string().length(2).optional(),
  professionDegree: professionDegreeSchema,
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credential lookup input." }, { status: 422 });
  }
  return NextResponse.json(await verifyCredential(parsed.data));
}
