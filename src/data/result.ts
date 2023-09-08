import { dbConfig } from "~/server/db/client";
import type { NewResult } from "~/server/db/schema";
import { resultsTable } from "~/server/db/schema";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { and, eq, isNull } from "drizzle-orm/expressions";

export async function createResult({
  userId,
  word,
  duration,
  date,
}: NewResult) {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const inserted = await db
    .insert(resultsTable)
    .values({ userId, word, duration, date })
    .returning();

  await pool.end();
  return inserted[0];
}

export async function addErrorDate({
  userId,
  word,
  errorDate,
}: {
  userId: string;
  word: string;
  errorDate: string;
}) {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const updated = await db
    .update(resultsTable)
    .set({ errorDate })
    .where(
      and(
        eq(resultsTable.word, word),
        eq(resultsTable.userId, userId),
        isNull(resultsTable.errorDate),
      ),
    )
    .returning();

  await pool.end();
  return updated[0];
}
