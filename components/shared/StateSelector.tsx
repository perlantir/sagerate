"use client";

import { STATES } from "@/lib/constants/states";
import { Select } from "@/components/ui/input";

export function StateSelector({
  value,
  onChange,
  includeAll = true,
}: {
  value: string;
  onChange: (value: string) => void;
  includeAll?: boolean;
}) {
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value)} aria-label="State">
      {includeAll ? <option value="all">All states</option> : null}
      {STATES.map((state) => (
        <option key={state.code} value={state.code}>
          {state.name}
        </option>
      ))}
    </Select>
  );
}
