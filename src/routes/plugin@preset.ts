import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import {
  createPreset,
  deletePreset,
  getPreset,
  listUserPresets,
  selectPreset,
  updatePreset,
} from "~/data/preset";
import { routeLoader$ } from "@builder.io/qwik-city";
import { getUserAndDb } from "./plugin@user";
import { getAnalyticsPerWord } from "~/data/result";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { getWordsFromText } from "~/utils";
import type { Preset } from "~/server/db/schema";

export const defaultPreset = {
  text: "",
  sessionLength: 50,
  speed: 30,
  repetitions: 3,
};

export const useCreateEmptyPreset = routeAction$(
  async ({ name }, { cookie, fail }) => {
    try {
      const { user, db } = await getUserAndDb(cookie);
      if (!user) {
        return { success: false, error: "You must login to create preset" };
      }
      await createPreset(db, {
        userId: user.id,
        name,
        ...defaultPreset,
      });

      return { success: true };
    } catch (e: any) {
      console.error(e);
      return fail(500, e.message);
    }
  },
  zod$({ name: z.string() }),
);

export const useUpdatePreset = routeAction$(
  async (
    {
      id,
      name,
      text,
      sessionLength,
      speed,
      repetitions,
      highlightLetter,
      forbidSimpleLetterBackspace,
      corpusSize,
      doubleLetters,
    },
    { cookie, fail },
  ) => {
    try {
      const { user, db } = await getUserAndDb(cookie);

      if (!user) {
        return { success: false, error: "You must login to update preset" };
      }

      await updatePreset(db, {
        id,
        userId: user.id,
        name,
        text,
        doubleLetters,
        ...(sessionLength && { sessionLength: parseInt(sessionLength) }),
        ...(speed && { speed: parseInt(speed) }),
        ...(repetitions && { repetitions: parseInt(repetitions) }),
        ...(corpusSize && { corpusSize: parseInt(corpusSize) }),
        highlightLetter: highlightLetter === "on",
        forbidSimpleLetterBackspace: forbidSimpleLetterBackspace === "on",
      });

      return { success: true };
    } catch (e: any) {
      console.error(e);
      return fail(500, e.message);
    }
  },
  zod$({
    id: z.string(),
    name: z.string().optional(),
    text: z.string().optional(),
    sessionLength: z.string().optional(),
    speed: z.string().optional(),
    repetitions: z.string().optional(),
    highlightLetter: z.string().optional(),
    forbidSimpleLetterBackspace: z.string().optional(),
    corpusSize: z.string().optional(),
    doubleLetters: z.string().optional(),
  }),
);

export const useListPresets = routeLoader$(async ({ cookie }) => {
  const { user, db } = await getUserAndDb(cookie);

  if (!user) {
    return { success: false, error: "You must login to list presets" };
  }

  const presets = await listUserPresets(db, user.id);

  return {
    success: true,
    data: presets,
  };
});

const getAnalyticsForPreset = async (
  db: NeonHttpDatabase,
  {
    preset,
    userId,
    cutoffDate,
    presetWords,
  }: {
    preset: Preset;
    presetWords: string[];
    userId: string;
    cutoffDate?: Date;
  },
) => {
  const { words, wordsRepartition } = await getAnalyticsPerWord(db, {
    userId: userId,
    repetitions: preset.repetitions,
    currentWords: presetWords,
    targetSpeed: preset.speed,
    doubleLetters: preset.doubleLetters || "",
    cutoffDate,
  });

  return {
    preset,
    words,
    nonValidatedWords: words.filter((w) => w.speed < preset.speed),
    wordsRepartition: {
      ...wordsRepartition,
      total: presetWords.length,
      remaining: presetWords.length - wordsRepartition.total,
    },
  };
};

export const usePresetAndTrainingWords = routeLoader$(async ({ cookie }) => {
  const { user, db } = await getUserAndDb(cookie);
  if (!user) return { success: false, error: "You must login to get preset" };
  if (!user.selectedPresetId)
    return { success: false, error: "No preset selected" };

  const preset = await getPreset(db, user.selectedPresetId);
  const presetWords = preset.corpusSize
    ? getWordsFromText(preset.text).slice(0, preset.corpusSize)
    : getWordsFromText(preset.text);

  const {
    wordsRepartition,
    words: allWords,
    nonValidatedWords,
  } = await getAnalyticsForPreset(db, {
    preset,
    presetWords,
    userId: user.id,
  });

  const factor = Math.min(
    preset.repetitions,
    preset.sessionLength / nonValidatedWords.length,
  );

  const words: { word: string; speed: number }[] = new Array(Math.ceil(factor))
    .fill(nonValidatedWords)
    .flat()
    .slice(0, preset.sessionLength - 1)
    .reverse();

  const { wordsRepartition: pastRepartition } = await getAnalyticsForPreset(
    db,
    {
      preset,
      presetWords,
      userId: user.id,
      cutoffDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  );

  const groupedWords = [];
  const step = Math.ceil(allWords.length / 30);
  for (let i = 0; i < allWords.length; i += step) {
    const words = allWords.slice(i, i + step);
    const speed = words.reduce((acc, w) => acc + w.speed, 0);
    const roundedSpeed = Math.round(speed * 10) / (words.length * 10);
    groupedWords.push(roundedSpeed);
  }

  return {
    success: true,
    preset,
    words,
    allWords: groupedWords,
    wordsRepartition,
    pastRepartition,
  };
});

export const useSelectPreset = routeAction$(
  async ({ id }, { cookie, fail }) => {
    try {
      const { user, db } = await getUserAndDb(cookie);

      if (!user) {
        return { success: false, error: "You must login to select preset" };
      }
      await selectPreset(db, { userId: user.id, presetId: id });
    } catch (e: any) {
      console.error(e);
      fail(500, e.message);
    }
  },
  zod$({ id: z.string() }),
);

export const useDeletePreset = routeAction$(
  async ({ id }, { cookie, fail }) => {
    try {
      const { user, db } = await getUserAndDb(cookie);

      if (!user) {
        return { success: false, error: "You must login to delete preset" };
      }

      await deletePreset(db, id);
    } catch (e: any) {
      console.error(e);
      fail(500, e.message);
    }
  },
  zod$({ id: z.string() }),
);
