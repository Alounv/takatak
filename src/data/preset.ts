import type { NewPreset } from "~/server/db/schema";
import { selectedPresetsTable } from "~/server/db/schema";
import { presetsTable } from "~/server/db/schema";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";
import { eq } from "drizzle-orm/expressions";

export const createPreset = async (
  db: NeonDatabase,
  { userId, name, text, sessionLength, speed, repetitions }: NewPreset,
) => {
  const inserted = await db
    .insert(presetsTable)
    .values({ userId, name, text, sessionLength, speed, repetitions })
    .returning();

  return inserted[0];
};

export const updatePreset = async (
  db: NeonDatabase,
  { id, ...partial }: Partial<NewPreset> & { id: string },
) => {
  const updated = await db
    .update(presetsTable)
    .set(partial)
    .where(eq(presetsTable.id, id))
    .returning();

  return updated[0];
};

export const getPreset = async (db: NeonDatabase, id: string) => {
  const preset = await db
    .select()
    .from(presetsTable)
    .where(eq(presetsTable.id, id));

  return preset[0];
};

export const listUserPresets = async (db: NeonDatabase, userId: string) => {
  const presets = await db
    .select()
    .from(presetsTable)
    .where(eq(presetsTable.userId, userId));

  return presets;
};

export const selectPreset = async (
  db: NeonDatabase,
  {
    userId,
    presetId,
  }: {
    userId: string;
    presetId: string;
  },
) => {
  const updated = await db
    .insert(selectedPresetsTable)
    .values({ userId, presetId })
    .onConflictDoUpdate({
      target: selectedPresetsTable.userId,
      set: { presetId },
    })
    .returning();

  return updated[0];
};

export const deletePreset = async (db: NeonDatabase, id: string) => {
  const deleted = await db
    .delete(presetsTable)
    .where(eq(presetsTable.id, id))
    .returning();

  return deleted[0];
};
