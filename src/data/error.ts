import type { NewError } from "~/server/db/schema";
import { errorsTable } from "~/server/db/schema";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";

export async function createError(
  db: NeonDatabase,
  { userId, word, input, date }: NewError,
) {
  const inserted = await db
    .insert(errorsTable)
    .values({ userId, word, input, date })
    .returning();

  return inserted[0];
}
