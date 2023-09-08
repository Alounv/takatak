import { routeLoader$ } from "@builder.io/qwik-city";
import { getUserAndDb } from "./plugin@user";
import { getAnalyticsPerWord } from "~/data/result";
import { getPreset } from "~/data/preset";

export const useValidatedWords = routeLoader$(async ({ cookie }) => {
  const { user, pool, db } = await getUserAndDb(cookie);
  if (!user) return { success: false, error: "You must login" };

  if (!user.selectedPresetId)
    return { success: false, error: "You must select a preset" };

  const preset = await getPreset(db, user.selectedPresetId);

  const analytics = await getAnalyticsPerWord(db, {
    userId: user.id,
    repetitions: preset.repetitions,
    currentWords: preset.text.split(" "),
  });

  await pool.end();
  return { success: true, data: analytics };
});
