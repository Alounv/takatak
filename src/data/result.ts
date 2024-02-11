import type { NewResult } from "~/server/db/schema";
import { resultsTable } from "~/server/db/schema";
import { and, desc, eq, inArray, lte, sql } from "drizzle-orm";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

export async function createResult(
  db: NeonHttpDatabase,
  { userId, word, duration }: NewResult,
) {
  await db.insert(resultsTable).values({ userId, word, duration }).returning();

  const currents = await db
    .select()
    .from(resultsTable)
    .where(and(eq(resultsTable.userId, userId), eq(resultsTable.word, word)))
    .orderBy(desc(resultsTable.date));

  const mostRecent = currents.slice(0, 3).map((c) => c.id);
  const obsoleteIds = currents
    .map((c) => c.id)
    .filter((c) => !mostRecent.includes(c));

  if (obsoleteIds.length) {
    await db.delete(resultsTable).where(inArray(resultsTable.id, obsoleteIds));
  }
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

  const nonValidatedWords = results.flatMap((r) => {
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
      return [];
    }

    return [{ word: r.word, speed: roundedSpeed }];
  });

  const typedWords = new Set(results.map((a) => a.word));

  nonValidatedWords.sort((a, b) => b.speed - a.speed);

  const neverTypedWords = currentWords
    .filter((w) => !typedWords.has(w))
    .map((w) => ({ word: w, speed: 0 }));

  return {
    nonValidatedWords: [...neverTypedWords, ...nonValidatedWords],
    wordsRepartition: {
      ...wordsRepartition,
      [repetitions]:
        (wordsRepartition[repetitions] || 0) - wordsRepartition.validated,
    },
  };
}
