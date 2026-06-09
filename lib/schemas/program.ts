import { z } from "zod";
import { professionDegreeSchema } from "@/lib/schemas/lead";

export const programSchema = z.object({
  lenderName: z.string().min(1),
  programName: z.string().optional(),
  acceptedDegrees: z.array(professionDegreeSchema).min(1),
  acceptsResidents: z.boolean().default(true),
  yearsFromTrainingMax: z.number().int().nullable().optional(),
  maxLoanAmountZeroDown: z.number().int().nullable().optional(),
  maxLoanAmount5Down: z.number().int().nullable().optional(),
  maxLoanAmount10Down: z.number().int().nullable().optional(),
  maxLoanAmountTotal: z.number().int().nullable().optional(),
  pmiRequired: z.boolean().default(false),
  rateTypesAvailable: z.array(z.string()).default([]),
  studentLoanTreatment: z.enum(["excluded", "ibr_payment", "full_payment", "varies"]),
  licensedStates: z.array(z.string()).default([]),
  requiresEmploymentContract: z.boolean().default(false),
  refinanceAvailable: z.boolean().default(false),
  cashOutAvailable: z.boolean().default(false),
  lenderWebsiteUrl: z.string().url().optional().or(z.literal("")),
  programNotes: z.string().optional(),
  isActive: z.boolean().default(true),
});
