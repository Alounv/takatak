import type { NewResult } from "~/server/db/schema";
import { resultsTable } from "~/server/db/schema";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

export async function createResult(
  db: NeonHttpDatabase,
  { userId, word, duration }: NewResult,
) {
  const inserted = await db
    .insert(resultsTable)
    .values({ userId, word, duration })
    .returning();

  return inserted[0];
}

export async function getAnalyticsPerWord(
  db: NeonHttpDatabase,
  {
    userId,
    repetitions,
    currentWords,
  }: { userId: string; repetitions: number; currentWords: string[] },
) {
  const sq = db
    .select()
    .from(resultsTable)
    .orderBy(desc(resultsTable.date))
    .where(
      and(
        eq(resultsTable.userId, userId),
        inArray(resultsTable.word, currentWords),
      ),
    )
    .as("sq");

  const results = await db
    .select({
      word: sq.word,
      count: sql<number>`count(${sq.id})`,
      lastDurations: sql<
        number[]
      >`(array_agg(${sq.duration}))[1:${repetitions}]`,
    })
    .from(sq)
    .groupBy(sq.word);

  const filteredResults = results.filter((r) => currentWords.includes(r.word));

  const analytics = filteredResults
    .filter((r) => r.count >= repetitions)
    .map((r) => {
      const maxDuration = Math.max(...r.lastDurations);
      return {
        word: r.word,
        speed: (((r.word.length + 1) / (maxDuration / 1000)) * 60) / 5,
      };
    })
    .sort((a, b) => b.speed - a.speed);

  return {
    analytics,
    practicedWordsCount: filteredResults.length,
  };
}
