import { PrismaClient } from "./src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
console.log("Using connection:", connectionString ? "found" : "MISSING");

const adapter = new PrismaPg({ connectionString: connectionString as string, max: 1 });
const prisma = new PrismaClient({ adapter });

prisma.waitlist
  .findMany({ take: 1 })
  .then((r) => {
    console.log("SUCCESS — rows:", r.length);
    process.exit(0);
  })
  .catch((e) => {
    console.error("ERROR:", e.message);
    process.exit(1);
  });
