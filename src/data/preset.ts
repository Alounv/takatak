import { dbConfig } from "~/server/db/client";
import type { NewPreset } from "~/server/db/schema";
import { selectedPresetsTable } from "~/server/db/schema";
import { presetsTable } from "~/server/db/schema";
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

  await pool.end();
  return preset[0];
};

export const listUserPresets = async (userId: string) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const presets = await db
    .select()
    .from(presetsTable)
    .where(eq(presetsTable.userId, userId));

  await pool.end();
  return presets;
};

export const selectPreset = async ({
  userId,
  presetId,
}: {
  userId: string;
  presetId: string;
}) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const updated = await db
    .insert(selectedPresetsTable)
    .values({ userId, presetId })
    .onConflictDoUpdate({
      target: selectedPresetsTable.userId,
      set: { presetId },
    })
    .returning();

  await pool.end();
  return updated[0];
};

export const deletePreset = async (id: string) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const deleted = await db
    .delete(presetsTable)
    .where(eq(presetsTable.id, id))
    .returning();

  await pool.end();
  return deleted[0];
};
