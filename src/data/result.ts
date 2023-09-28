import type { NewResult } from "~/server/db/schema";
import { resultsTable } from "~/server/db/schema";
import { and, eq, inArray, lte, sql } from "drizzle-orm";
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
    targetSpeed,
    cutoffDate,
    doubleLetters,
  }: {
    userId: string;
    repetitions: number;
    currentWords: string[];
    targetSpeed: number;
    cutoffDate?: Date;
    doubleLetters: string;
  },
) {
  const sq = db
    .select()
    .from(resultsTable)
    .where(
      and(
        eq(resultsTable.userId, userId),
        inArray(resultsTable.word, currentWords),
        cutoffDate ? lte(resultsTable.date, cutoffDate) : undefined,
      ),
    )
    .as("sq");

  const results = await db
    .select({
      word: sq.word,
      count: sql<number>`count(${sq.id})`,
      lastDurations: sql<
        number[]
      >`(array_agg(${sq.duration} ORDER BY ${sq.date} DESC))[1:${repetitions}]`,
    })
    .from(sq)
    .groupBy(sq.word);

  const wordsRepartition: Record<string, number> & {
    validated: number;
    total: number;
  } = {
    validated: 0,
    total: results.length,
  };

  const analytics = results.map((r) => {
    const count = Math.min(r.count, repetitions);
    wordsRepartition[count] ??= 0;
    wordsRepartition[count] += 1;
    const avgDuration =
      r.lastDurations.reduce((a, b) => a + b, 0) / r.lastDurations.length;

    const lettersCount =
      r.word.length + // word
      1 + // space
      r.word.split("").filter((l) => doubleLetters.includes(l)).length; // double letters

    const speed = ((lettersCount / (avgDuration / 1000)) * 60) / 5;
    const roundedSpeed = Math.round(speed * 10) / 10;

    if (r.count >= repetitions && speed >= targetSpeed) {
      wordsRepartition["validated"] ??= 0;
      wordsRepartition["validated"] += 1;
    }
    return { word: r.word, speed: roundedSpeed };
  });

  return {
    analytics,
    wordsRepartition: {
      ...wordsRepartition,
      [repetitions]:
        (wordsRepartition[repetitions] || 0) - wordsRepartition.validated,
    },
  };
}
