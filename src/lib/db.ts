import "server-only";

import { PrismaNeon } from "@prisma/adapter-neon";

import { PrismaClient } from "@/generated/prisma/client";

/**
 * The sample strings Prisma and Neon ship in their docs. Treating them as
 * "not configured" means a half-finished .env produces the setup card instead
 * of a connection timeout thirty seconds later.
 */
const PLACEHOLDER = /randompassword|johndoe|user:password|username:password|<[^>]+>|YOUR_/i;

export function databaseUrl(): string | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!/^postgres(ql)?:\/\//i.test(url)) return null;
  if (PLACEHOLDER.test(url)) return null;
  return url;
}

export function isDatabaseConfigured(): boolean {
  return databaseUrl() !== null;
}

// Next.js discards module scope on every hot reload in development, which would
// otherwise open a fresh Neon pool per edit until the database refuses more.
const globalForPrisma = globalThis as unknown as { kathmaxxingPrisma?: PrismaClient };

export function getPrisma(): PrismaClient | null {
  const connectionString = databaseUrl();
  if (!connectionString) return null;

  if (!globalForPrisma.kathmaxxingPrisma) {
    globalForPrisma.kathmaxxingPrisma = new PrismaClient({
      adapter: new PrismaNeon({ connectionString }),
    });
  }

  return globalForPrisma.kathmaxxingPrisma;
}
