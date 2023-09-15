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
      corpusSize,
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
        ...(sessionLength && { sessionLength: parseInt(sessionLength) }),
        ...(speed && { speed: parseInt(speed) }),
        ...(repetitions && { repetitions: parseInt(repetitions) }),
        ...(corpusSize && { corpusSize: parseInt(corpusSize) }),
        highlightLetter: highlightLetter === "on",
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
    corpusSize: z.string().optional(),
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
    presetId,
    userId,
    cutoffDate,
  }: {
    presetId: string;
    userId: string;
    cutoffDate?: Date;
  },
) => {
  const preset = await getPreset(db, presetId);
  const presetWords = preset.corpusSize
    ? getWordsFromText(preset.text).slice(0, preset.corpusSize)
    : getWordsFromText(preset.text);

  const { analytics, wordsRepartition } = await getAnalyticsPerWord(db, {
    userId: userId,
    repetitions: preset.repetitions,
    currentWords: presetWords,
    targetSpeed: preset.speed,
    cutoffDate,
  });

  return {
    preset,
    analytics,
    presetWords,
    wordsRepartition: {
      ...wordsRepartition,
      total: presetWords.length,
      remaining: presetWords.length - wordsRepartition.total,
    },
  };
};

export const useAnalyticsForYesterday = routeLoader$(async ({ cookie }) => {
  const { user, db } = await getUserAndDb(cookie);
  if (!user) return { success: false, error: "You must login to get preset" };
  if (!user.selectedPresetId)
    return { success: false, error: "No preset selected" };

  const { wordsRepartition } = await getAnalyticsForPreset(db, {
    presetId: user.selectedPresetId,
    userId: user.id,
    cutoffDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
  });

  return { success: true, wordsRepartition };
});

export const usePresetAndTrainingWords = routeLoader$(async ({ cookie }) => {
  const { user, db } = await getUserAndDb(cookie);
  if (!user) return { success: false, error: "You must login to get preset" };
  if (!user.selectedPresetId)
    return { success: false, error: "No preset selected" };

  const { wordsRepartition, analytics, preset, presetWords } =
    await getAnalyticsForPreset(db, {
      presetId: user.selectedPresetId,
      userId: user.id,
    });

  const validatedWords = preset
    ? analytics.filter((x) => x.speed >= preset.speed).map((x) => x.word)
    : [];

  const nonValidatedWords = presetWords.filter(
    (x) => !validatedWords.includes(x),
  );

  const factor = Math.min(5, preset.sessionLength / nonValidatedWords.length);

  const practiceWords = new Array(Math.ceil(factor))
    .fill(nonValidatedWords)
    .flat()
    .sort(() => Math.random() - 0.5);

  const words = [" ", ...practiceWords.slice(0, preset.sessionLength - 1)];

  return {
    success: true,
    preset,
    words,
    wordsRepartition,
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
