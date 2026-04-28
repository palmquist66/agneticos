import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-semibold">GLP-1 Companion</span>
          <div className="flex gap-2">
            <Link href="/sign-in" className={buttonVariants({ variant: "ghost" })}>
              Log in
            </Link>
            <Link href="/sign-up" className={buttonVariants()}>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Stop tracking.
          <br />
          Start seeing.
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          The pattern layer for your GLP-1 journey. Log meals, weight, glucose,
          and side effects — then let AI find the connections your doctor needs
          to see.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
            Get Started Free
          </Link>
        </div>
      </main>

      <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
        GLP-1 Companion &mdash; Not medical advice. Always consult your
        healthcare provider.
      </footer>
    </div>
  );
}
