"use client";

import { useRouter } from "next/navigation";
import {
  Camera,
  PenLine,
  CookingPot,
  Scale,
  Droplets,
  Frown,
  Syringe,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

const foodActions = [
  {
    href: "/log/meal-photo",
    label: "Snap a Meal",
    icon: Camera,
  },
  {
    href: "/log/meal-text",
    label: "Describe a Meal",
    icon: PenLine,
  },
  {
    href: "/log/recipe",
    label: "Log a Recipe",
    icon: CookingPot,
  },
] as const;

const healthActions = [
  {
    href: "/log/weight",
    label: "Weight",
    icon: Scale,
  },
  {
    href: "/log/glucose",
    label: "Glucose",
    icon: Droplets,
  },
  {
    href: "/log/side-effect",
    label: "Side Effect",
    icon: Frown,
  },
  {
    href: "/log/glp1-dose",
    label: "GLP-1 Dose",
    icon: Syringe,
  },
] as const;

export function FABSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  function navigate(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-8">
        <SheetHeader className="pb-2">
          <SheetTitle className="text-center text-base">
            What are you logging?
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-1">
          {foodActions.map((action) => (
            <ActionRow
              key={action.href}
              icon={action.icon}
              label={action.label}
              onClick={() => navigate(action.href)}
            />
          ))}
        </div>

        <Separator className="my-2" />

        <div className="space-y-1">
          {healthActions.map((action) => (
            <ActionRow
              key={action.href}
              icon={action.icon}
              label={action.label}
              onClick={() => navigate(action.href)}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ActionRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors hover:bg-accent active:bg-accent/80"
    >
      <Icon className="h-5 w-5 text-muted-foreground" />
      <span>{label}</span>
    </button>
  );
}
