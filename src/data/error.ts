import { NewError, errorsTable } from "~/server/db/schema";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { dbConfig } from "~/server/db/client";

export async function createError({ userId, word, input, date }: NewError) {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const inserted = await db
    .insert(errorsTable)
    .values({ userId, word, input, date })
    .returning();

  await pool.end();
  return inserted[0];
}
