import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    // Prefer DIRECT_URL (port 5432) over DATABASE_URL (pgbouncer port 6543).
    // PrismaPg uses prepared statements which are incompatible with
    // Supabase pgbouncer in transaction mode. Direct connection avoids this.
    const connectionString =
      process.env.DIRECT_URL || process.env.DATABASE_URL!;
    const adapter = new PrismaPg({
      connectionString,
      max: process.env.VERCEL ? 1 : 10,
    });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
