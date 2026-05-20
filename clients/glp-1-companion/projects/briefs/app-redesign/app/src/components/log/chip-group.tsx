"use client";

import { cn } from "@/lib/utils";

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  multiple = false,
  label,
}: {
  options: { value: T; label: string }[];
  value: T | T[];
  onChange: (value: T | T[]) => void;
  multiple?: boolean;
  label?: string;
}) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const toggle = (optionValue: T) => {
    if (multiple) {
      const current = selected as T[];
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      onChange(next);
    } else {
      onChange(optionValue);
    }
  };

  return (
    <div>
      {label && (
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          {label}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:bg-muted"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
