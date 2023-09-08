import type { NewResult } from "~/server/db/schema";
import { resultsTable } from "~/server/db/schema";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import { and, eq, isNull } from "drizzle-orm/expressions";

export async function createResult(
  db: NeonDatabase,
  { userId, word, duration, date }: NewResult,
) {
  const inserted = await db
    .insert(resultsTable)
    .values({ userId, word, duration, date })
    .returning();

  return inserted[0];
}

export async function addErrorDate(
  db: NeonDatabase,
  {
    userId,
    word,
    errorDate,
  }: {
    userId: string;
    word: string;
    errorDate: string;
  },
) {
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

  return updated;
}
