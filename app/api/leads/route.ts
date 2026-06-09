import { NextResponse } from "next/server";
import { leadSubmissionSchema } from "@/lib/schemas/lead";
import { calculateLeadScore } from "@/lib/scoring/leadScorer";
import { createLeadRecord, findDuplicateLead, listLeads } from "@/lib/services/leads";
import { countMatchedPrograms } from "@/lib/services/programs";
import { sendNewLeadNotification } from "@/lib/services/notifications";
import { checkLeadSubmissionRateLimit } from "@/lib/utils/rateLimit";
import { verifyCredential } from "@/lib/validation/credential";
import { validateEmail } from "@/lib/validation/email";
import { scoreIpAddress } from "@/lib/validation/ip";
import { validatePhone } from "@/lib/validation/phone";
import { lookupZip } from "@/lib/validation/zip";

export async function GET() {
  const leads = await listLeads();
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  const ipAddress = getIpAddress(request);
  const rate = await checkLeadSubmissionRateLimit(ipAddress);
  if (!rate.success) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = leadSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid lead submission.", issues: parsed.error.flatten() }, { status: 422 });
  }

  const input = parsed.data;
  const recaptcha = await verifyRecaptcha(input.recaptchaToken, ipAddress);
  if (!recaptcha.ok) {
    return NextResponse.json({ error: "We could not verify this submission. Please try again." }, { status: 403 });
  }

  const [zip, phone, email, ipScore] = await Promise.all([
    lookupZip(input.propertyZip),
    validatePhone(input.phone),
    validateEmail(input.email),
    scoreIpAddress(ipAddress),
  ]);

  if (!phone.valid) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 422 });
  }

  if (!email.valid) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });
  }

  const duplicate = await findDuplicateLead(input.email, input.phone);
  const credential = await verifyCredential({
    firstName: input.firstName,
    lastName: input.lastName,
    state: zip?.state ?? input.propertyState,
    professionDegree: input.professionDegree,
  });

  const matchedProgramCount = await countMatchedPrograms({
    degree: input.professionDegree,
    state: zip?.state ?? input.propertyState,
    loanAmount: input.purchasePrice ?? input.estimatedHomeValue ?? null,
    loanPurpose: input.loanPurpose,
    careerStage: input.careerStage,
  });

  const qualityScore = calculateLeadScore({
    ...input,
    credentialVerified: credential.verified,
    phoneType: phone.type,
    ipFraudScore: ipScore.score,
  });

  const lead = await createLeadRecord(input, {
    qualityScore,
    propertyCity: zip?.city ?? input.propertyCity,
    propertyState: zip?.state ?? input.propertyState,
    phoneType: phone.type,
    credentialVerified: credential.verified,
    credentialVerificationSource: credential.source,
    credentialVerificationId: credential.id,
    ipAddress,
    ipFraudScore: ipScore.score,
    userAgent: request.headers.get("user-agent"),
    recaptchaScore: recaptcha.score,
    isDuplicate: Boolean(duplicate),
    duplicateOfLeadId: duplicate?.id ?? null,
    matchedProgramCount,
  });

  await sendNewLeadNotification(lead);

  return NextResponse.json({
    success: true,
    leadId: lead.id,
    matchedProgramCount: lead.matchedProgramCount,
    qualityScore: lead.qualityScore,
  });
}

function getIpAddress(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}

async function verifyRecaptcha(token: string | null | undefined, ipAddress: string) {
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    return { ok: true, score: null };
  }
  if (!token) return { ok: false, score: null };

  try {
    const form = new URLSearchParams();
    form.set("secret", process.env.RECAPTCHA_SECRET_KEY);
    form.set("response", token);
    form.set("remoteip", ipAddress);
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: form,
    });
    const data = (await response.json()) as { success?: boolean; score?: number };
    return { ok: Boolean(data.success) && (data.score ?? 1) >= 0.4, score: data.score ?? null };
  } catch {
    return { ok: true, score: null };
  }
}
