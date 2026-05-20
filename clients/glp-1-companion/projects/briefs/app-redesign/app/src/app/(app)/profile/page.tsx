import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { ProfileInfoCard } from "@/components/profile/profile-info-card";
import { HealthTargetsCard } from "@/components/profile/health-targets-card";
import { DataSourcesCard } from "@/components/profile/data-sources-card";
import { ThemeToggle } from "@/components/profile/theme-toggle";
import { NotificationToggle } from "@/components/push/notification-toggle";
import { DexcomCallbackToast } from "@/components/profile/dexcom-callback-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  const connections = await db.dataSourceConnection.findMany({
    where: { userId: user.id },
    select: {
      id: true,
      source: true,
      status: true,
      lastSyncAt: true,
      lastSyncRecords: true,
    },
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="text-lg font-semibold">Profile</h1>

      {/* Post-OAuth feedback toast */}
      <DexcomCallbackToast />

      <div className="mt-6 space-y-4">
        <ProfileInfoCard
          name={user.name}
          glp1Med={user.glp1Med}
          glp1Dosage={user.glp1Dosage}
          otherMeds={user.otherMeds}
        />

        <HealthTargetsCard
          goalWeight={user.goalWeight}
          proteinTarget={user.proteinTarget}
          glucoseMin={user.glucoseMin}
          glucoseMax={user.glucoseMax}
        />

        {/* Medication Reminders */}
        <NotificationToggle />

        {/* Connected Data Sources */}
        <DataSourcesCard connections={connections} />

        {/* Doctor Export */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Export</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Generate a printable 30-day health summary to share with your healthcare provider.
            </p>
            <a
              href="/api/export/doctor-report"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <FileText className="h-4 w-4" />
              Generate Report
              <ExternalLink className="h-3 w-3" />
            </a>
          </CardContent>
        </Card>

        {/* Appearance */}
        <ThemeToggle />

        {/* Account */}
        {process.env.DEMO_MODE !== "true" && (
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <UserButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
