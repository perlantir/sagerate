export const CREDIT_RANGES = [
  { value: "excellent_740_plus", label: "Excellent", helper: "740+", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "good_680_739", label: "Good", helper: "680-739", color: "bg-lime-50 text-lime-700 border-lime-200" },
  { value: "fair_620_679", label: "Fair", helper: "620-679", color: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "below_620", label: "Below 620", helper: "Still compare options", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "not_sure", label: "Not Sure", helper: "Estimate is fine", color: "bg-slate-50 text-slate-600 border-slate-200" },
] as const;
