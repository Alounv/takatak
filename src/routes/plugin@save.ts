import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { createError } from "~/data/error";
import { createResult } from "~/data/result";
import { getUserAndDb } from "./plugin@user";

export const useSaveData = routeAction$(
  async ({ word, duration }, { cookie, fail }) => {
    try {
      const { user, db } = await getUserAndDb(cookie);

      if (!user) {
        return {
          success: false,
          error: "You must login to save result",
        };
      }

      await createResult(db, {
        userId: user.id,
        word,
        duration,
      });

      return { success: true };
    } catch (e: any) {
      console.error(e);
      return fail(500, e.message);
    }
  },
  zod$({ word: z.string(), duration: z.number() }),
);

export const useSaveError = routeAction$(
  async ({ word, input }, { cookie, fail }) => {
    try {
      const { user, db } = await getUserAndDb(cookie);

      if (!user) {
        return {
          success: false,
          error: "You must login to save error",
        };
      }

      await createError(db, {
        userId: user.id,
        word,
        input,
      });

      return { success: true };
    } catch (e: any) {
      console.error(e);
      return fail(500, e.message);
    }
  },
  zod$({ word: z.string(), input: z.string() }),
);
