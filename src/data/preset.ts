import { dbConfig } from "~/server/db/client";
import { NewPreset, presetsTable } from "~/server/db/schema";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm/expressions";

export const createPreset = async ({
  userId,
  name,
  text,
  sessionLength,
  speed,
  repetitions,
}: NewPreset) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const inserted = await db
    .insert(presetsTable)
    .values({ userId, name, text, sessionLength, speed, repetitions })
    .returning();

  await pool.end();
  return inserted[0];
};

export const updatePreset = async ({
  id,
  ...partial
}: Partial<NewPreset> & { id: string }) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const updated = await db
    .update(presetsTable)
    .set(partial)
    .where(eq(presetsTable.id, id))
    .returning();

  await pool.end();
  return updated[0];
};

export const getPreset = async (id: string) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const preset = await db
    .select()
    .from(presetsTable)
    .where(eq(presetsTable.id, id));

  return preset[0];
};

export const listUserPresets = async (userId: string) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const presets = await db
    .select()
    .from(presetsTable)
    .where(eq(presetsTable.userId, userId));

  return presets;
};
