"use client";

import { create } from "zustand";
import type { LeadSubmissionInput } from "@/lib/schemas/lead";

type FormData = Partial<LeadSubmissionInput> & {
  sessionId?: string;
  zipConfirmation?: string;
};

type FormStore = {
  step: number;
  data: FormData;
  setStep: (step: number) => void;
  next: () => void;
  back: () => void;
  update: (patch: FormData) => void;
  reset: () => void;
};

const initialData: FormData = {
  intakePath: "multi_step_form",
  loanProgramType: "professional",
  loanPurpose: "purchase",
  propertyUse: "primary",
  sessionId: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now()),
};

export const useFormStore = create<FormStore>((set) => ({
  step: 0,
  data: initialData,
  setStep: (step) => set({ step }),
  next: () => set((state) => ({ step: Math.min(state.step + 1, 14) })),
  back: () => set((state) => ({ step: Math.max(state.step - 1, 0) })),
  update: (patch) => set((state) => ({ data: { ...state.data, ...patch } })),
  reset: () => set({ step: 0, data: initialData }),
}));
