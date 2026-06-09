export function FormProgressBar({ step, total }: { step: number; total: number }) {
  const percent = Math.round(((step + 1) / total) * 100);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-600">
        <span>
          Step {step + 1} of {total}
        </span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
