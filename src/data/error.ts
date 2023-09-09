import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { NewError } from "~/server/db/schema";
import { errorsTable } from "~/server/db/schema";

export async function createError(
  db: NeonHttpDatabase,
  { userId, word, input, date }: NewError,
) {
  const inserted = await db
    .insert(errorsTable)
    .values({ userId, word, input, date })
    .returning();

  return inserted[0];
}
