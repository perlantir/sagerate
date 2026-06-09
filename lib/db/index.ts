import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) return null;
  if (cachedDb) return cachedDb;
  const client = postgres(process.env.DATABASE_URL, { prepare: false });
  cachedDb = drizzle(client, { schema });
  return cachedDb;
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}
