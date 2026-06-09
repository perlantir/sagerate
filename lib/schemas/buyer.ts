import { z } from "zod";
import { professionDegreeSchema } from "@/lib/schemas/lead";

export const buyerSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  buyerType: z.enum(["direct_lender", "credit_union", "aggregator", "broker"]),
  licensedStates: z.array(z.string()).default([]),
  acceptedDegrees: z.array(professionDegreeSchema).default([]),
  acceptsResidents: z.boolean().default(true),
  maxLeadsPerDay: z.number().int().optional(),
  maxLeadsPerMonth: z.number().int().optional(),
  pricePerLeadExclusive: z.number().optional(),
  pricePerLeadShared: z.number().optional(),
  status: z.enum(["active", "paused", "onboarding", "churned"]).default("onboarding"),
});
