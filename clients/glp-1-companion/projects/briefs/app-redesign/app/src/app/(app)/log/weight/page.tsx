import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { WeightForm } from "./weight-form";

export const dynamic = "force-dynamic";

export default async function WeightPage() {
  const user = await getCurrentUser();

  const lastLog = await db.weightLog.findFirst({
    where: { userId: user.id },
    orderBy: { loggedAt: "desc" },
    select: { weight: true },
  });

  return <WeightForm lastWeight={lastLog?.weight ?? null} />;
}
