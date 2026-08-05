import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

if (process.env.VERCEL || process.env.NODE_ENV === "production") {
  const tmpDbPath = "/tmp/dev.db";
  const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");

  if (!fs.existsSync(tmpDbPath)) {
    if (fs.existsSync(sourceDbPath)) {
      try {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      } catch (e) {
        console.error("Failed to copy dev.db to /tmp:", e);
      }
    }
  }
  process.env.DATABASE_URL = `file:${tmpDbPath}`;
} else if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;


