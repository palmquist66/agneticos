export function NutritionDisplay({
  calories,
  protein,
  carbs,
  fat,
}: {
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}) {
  const items = [
    { label: "Cal", value: calories, unit: "" },
    { label: "Protein", value: protein, unit: "g" },
    { label: "Carbs", value: carbs, unit: "g" },
    { label: "Fat", value: fat, unit: "g" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 rounded-lg border bg-muted/50 p-3">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <p className="text-lg font-semibold tabular-nums">
            {item.value !== null ? Math.round(item.value) : "—"}
            {item.value !== null && (
              <span className="text-xs font-normal text-muted-foreground">
                {item.unit}
              </span>
            )}
          </p>
          <p className="text-[11px] text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
