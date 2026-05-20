import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppHeader } from "@/components/nav/app-header";
import { BottomNav } from "@/components/nav/bottom-nav";
import { AutoSync } from "@/components/sync/auto-sync";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user.onboarded) {
    redirect("/onboarding/medication");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
      <AutoSync />
    </div>
  );
}
