import type { NewPreset } from "~/server/db/schema";
import { selectedPresetsTable } from "~/server/db/schema";
import { presetsTable } from "~/server/db/schema";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { SharedTextNames, getSharedText } from "./texts";

export const createPreset = async (
  db: NeonHttpDatabase,
  { userId, name, text, sessionLength, speed, repetitions }: NewPreset,
) => {
  const inserted = await db
    .insert(presetsTable)
    .values({
      userId,
      name,
      text,
      sessionLength,
      speed,
      repetitions,
      isShared: false,
    })
    .returning();

  return inserted[0];
};

export const createInitialPresets = async (
  db: NeonHttpDatabase,
  {
    userId,
    sessionLength,
    speed,
    repetitions,
  }: Pick<NewPreset, "userId" | "sessionLength" | "speed" | "repetitions">,
) => {
  const presestToCreate = Object.values(SharedTextNames).map((name) => ({
    userId,
    name,
    text: "",
    sessionLength,
    speed,
    repetitions,
    isShared: true,
  }));

  const inserted = await db
    .insert(presetsTable)
    .values(presestToCreate)
    .returning();

  return inserted;
};

export const updatePreset = async (
  db: NeonHttpDatabase,
  { id, ...partial }: Partial<NewPreset> & { id: string },
) => {
  const updated = await db
    .update(presetsTable)
    .set(partial)
    .where(eq(presetsTable.id, id))
    .returning();

  return updated[0];
};

export const getPreset = async (db: NeonHttpDatabase, id: string) => {
  const [p] = await db
    .select()
    .from(presetsTable)
    .where(eq(presetsTable.id, id));

  return {
    ...p,
    text: p.isShared ? getSharedText(p.name) : p.text,
  };
};

export const listUserPresets = async (db: NeonHttpDatabase, userId: string) => {
  const presets = await db
    .select()
    .from(presetsTable)
    .where(eq(presetsTable.userId, userId));

  return presets.map((p) => ({
    ...p,
    text: p.isShared ? getSharedText(p.name) : p.text,
  }));
};

export const selectPreset = async (
  db: NeonHttpDatabase,
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

export const deletePreset = async (db: NeonHttpDatabase, id: string) => {
  const deleted = await db
    .delete(presetsTable)
    .where(eq(presetsTable.id, id))
    .returning();

  return deleted[0];
};
