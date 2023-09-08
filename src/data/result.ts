import type { NewResult } from "~/server/db/schema";
import { resultsTable } from "~/server/db/schema";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import { and, eq, isNull } from "drizzle-orm/expressions";
import { sql } from "drizzle-orm";

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

export async function getAnalyticsPerWord(
  db: NeonDatabase,
  {
    userId,
    repetitions,
    currentWords,
  }: { userId: string; repetitions: number; currentWords: string[] },
) {
  const results = await db
    .select({
      count: sql<number>`count(${resultsTable.id})`,
      duration: sql<number>`avg(${resultsTable.duration})`,
      word: resultsTable.word,
    })
    .from(resultsTable)
    .where(and(eq(resultsTable.userId, userId), isNull(resultsTable.errorDate)))
    .groupBy(resultsTable.word);

  const filteredResults = results
    .filter((r) => r.count >= repetitions && currentWords.includes(r.word))
    .map((r) => {
      return {
        word: r.word,
        speed: (((r.word.length + 1) / (r.duration / 1000)) * 60) / 5,
      };
    })
    .sort((a, b) => b.speed - a.speed);

  return filteredResults;
}
