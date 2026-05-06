"use client";

import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-pt">
      <div className="flex h-12 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-mark.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="font-heading text-sm font-semibold text-primary">
            GLP-1 Companion
          </span>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
