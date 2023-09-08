import { routeLoader$ } from "@builder.io/qwik-city";
import { getUserAndDb } from "./plugin@user";
import { getAnalyticsPerWord } from "~/data/result";

export const useValidatedWords = routeLoader$(async ({ cookie }) => {
  const { user, pool, db } = await getUserAndDb(cookie);
  if (!user) return { success: false, error: "You must login" };

  const analytics = await getAnalyticsPerWord(db, {
    userId: user.id,
    repetitions: 3,
  });

  await pool.end();
  return { success: true, data: analytics };
});
