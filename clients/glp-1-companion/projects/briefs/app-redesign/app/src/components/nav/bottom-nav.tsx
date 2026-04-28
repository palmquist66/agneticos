"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Pill, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { FAB } from "./fab";

const tabs = [
  { href: "/today", label: "Today", icon: Home },
  { href: "/trends", label: "Trends", icon: BarChart3 },
  // FAB goes in the center (rendered separately)
  { href: "/meds", label: "Meds", icon: Pill },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-pb">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {tabs.slice(0, 2).map((tab) => (
          <NavItem
            key={tab.href}
            href={tab.href}
            label={tab.label}
            icon={tab.icon}
            active={pathname.startsWith(tab.href)}
          />
        ))}

        <FAB />

        {tabs.slice(2).map((tab) => (
          <NavItem
            key={tab.href}
            href={tab.href}
            label={tab.label}
            icon={tab.icon}
            active={pathname.startsWith(tab.href)}
          />
        ))}
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 px-3 py-1 text-xs transition-colors",
        active
          ? "text-primary font-medium"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", active && "fill-current")} />
      <span>{label}</span>
    </Link>
  );
}
