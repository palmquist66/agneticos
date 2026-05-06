"use client";

import { Minus, Plus } from "lucide-react";

export function NumberInput({
  value,
  onChange,
  step = 1,
  min,
  max,
  unit,
  placeholder,
}: {
  value: number | null;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
  placeholder?: string;
}) {
  const decrement = () => {
    const next = (value ?? 0) - step;
    if (min !== undefined && next < min) return;
    onChange(parseFloat(next.toFixed(2)));
  };

  const increment = () => {
    const next = (value ?? 0) + step;
    if (max !== undefined && next > max) return;
    onChange(parseFloat(next.toFixed(2)));
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={decrement}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-secondary text-primary active:bg-primary/10"
      >
        <Minus className="h-5 w-5" />
      </button>
      <div className="flex items-baseline gap-1.5">
        <input
          type="number"
          inputMode="decimal"
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          className="w-28 bg-transparent text-center text-4xl font-bold tabular-nums outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          min={min}
          max={max}
          step={step}
        />
        {unit && (
          <span className="text-lg text-muted-foreground">{unit}</span>
        )}
      </div>
      <button
        type="button"
        onClick={increment}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-secondary text-primary active:bg-primary/10"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
