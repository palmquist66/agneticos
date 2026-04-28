"use client";

import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-pt">
      <div className="flex h-12 items-center justify-between px-4">
        <span className="text-sm font-semibold">GLP-1 Companion</span>
        <UserButton />
      </div>
    </header>
  );
}
