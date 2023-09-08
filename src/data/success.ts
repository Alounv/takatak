import { getIsTheSameDay } from "~/utilities/date";
import { eq, desc } from "drizzle-orm/expressions";
import type { NewSuccess } from "~/server/db/schema";
import { successTable } from "~/server/db/schema";
import { Pool } from "@neondatabase/serverless";
import { dbConfig } from "~/server/db/client";
import { drizzle } from "drizzle-orm/neon-serverless";

export const setSuccess = async ({
  objectiveId,
  date,
  isDone,
}: NewSuccess & { isDone: boolean }) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const success = await db
    .select()
    .from(successTable)
    .where(eq(successTable.objectiveId, objectiveId))
    .orderBy(desc(successTable.date));

  const currentSuccess = success.find(
    (s) => date && getIsTheSameDay(s.date, date),
  );

  if (currentSuccess && !isDone) {
    const success = await db
      .delete(successTable)
      .where(eq(successTable.id, currentSuccess.id))
      .returning();
    return success[0];
  }

  const inserted = await db
    .insert(successTable)
    .values({ date, objectiveId })
    .returning();

  await pool.end();
  return inserted[0];
};
