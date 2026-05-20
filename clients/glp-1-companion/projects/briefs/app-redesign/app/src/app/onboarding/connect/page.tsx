import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ConnectForm } from "./connect-form";

export const dynamic = "force-dynamic";

export default async function OnboardingConnectPage() {
  const user = await getCurrentUser();

  const connections = await db.dataSourceConnection.findMany({
    where: { userId: user.id },
  });

  const connectedSources = connections
    .filter((c) => c.status === "connected")
    .map((c) => c.source);

  return <ConnectForm connectedSources={connectedSources} />;
}
