import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { createError } from "~/data/error";
import { addErrorDate, createResult } from "~/data/result";
import { getUserFromCookie } from "~/data/user";

export const useSaveData = routeAction$(
  async ({ word, duration }, { cookie, fail }) => {
    const date = new Date().toISOString();
    try {
      const user = await getUserFromCookie(cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to save result",
        };
      }
      await createResult({
        userId: user.id,
        word,
        duration,
        date,
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
    const date = new Date().toISOString();
    try {
      const user = await getUserFromCookie(cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to save error",
        };
      }
      await createError({
        userId: user.id,
        word,
        input,
        date,
      });
      await addErrorDate({
        userId: user.id,
        word,
        errorDate: date,
      });
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return fail(500, e.message);
    }
  },
  zod$({ word: z.string(), input: z.string() }),
);
