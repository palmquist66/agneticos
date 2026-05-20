"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function LogPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <h1 className="mb-6 text-xl font-semibold">{title}</h1>
      {children}
    </div>
  );
}
