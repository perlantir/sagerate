import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;
let cachedClient: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) return null;
  if (cachedDb) return cachedDb;
  cachedClient = postgres(process.env.DATABASE_URL, { prepare: false });
  cachedDb = drizzle(cachedClient, { schema });
  return cachedDb;
}

export function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

export async function closeDb() {
  if (!cachedClient) return;
  await cachedClient.end({ timeout: 5 });
  cachedClient = null;
  cachedDb = null;
}
