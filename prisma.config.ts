import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js reads .env.local ahead of .env, so the CLI has to as well - otherwise
// `prisma db push` and the running app can be pointed at different databases,
// or the CLI finds no connection string at all.
config({ path: [".env.local", ".env"], quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DATABASE_URL"] },
});
