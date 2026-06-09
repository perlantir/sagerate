import { Resend } from "resend";
import { getDegreeLabel, getLoanProgramTypeLabel } from "@/lib/constants/professions";
import type { LeadRecord } from "@/lib/types";

export async function sendNewLeadNotification(lead: LeadRecord) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_NOTIFICATION_EMAIL) {
    return { sent: false, skipped: true };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "ProLoanMatch <leads@proloanmatch.com>",
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      subject: `New ${getLoanProgramTypeLabel(lead.loanProgramType)} lead: ${getDegreeLabel(lead.professionDegree)} in ${lead.propertyState ?? "unknown state"}`,
      text: [
        `${lead.firstName} ${lead.lastName}`,
        `${lead.email} | ${lead.phone}`,
        `Quality score: ${lead.qualityScore}`,
        `Matched programs: ${lead.matchedProgramCount}`,
        `Intake path: ${lead.intakePath}`,
      ].join("\n"),
    });
    return { sent: true, skipped: false };
  } catch {
    return { sent: false, skipped: false };
  }
}
