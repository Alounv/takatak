import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { createError } from "~/data/error";
import { addErrorDate, createResult } from "~/data/result";
import { getUserFromCookie } from "~/data/user";
import { dbConfig } from "~/server/db/client";

export const useSaveData = routeAction$(
  async ({ word, duration }, { cookie, fail }) => {
    try {
      const pool = new Pool(dbConfig);
      const db = drizzle(pool);

      const user = await getUserFromCookie(db, cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to save result",
        };
      }

      const date = new Date().toISOString();
      await createResult(db, {
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
    try {
      const pool = new Pool(dbConfig);
      const db = drizzle(pool);

      const user = await getUserFromCookie(db, cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to save error",
        };
      }

      const date = new Date().toISOString();
      await createError(db, {
        userId: user.id,
        word,
        input,
        date,
      });
      await addErrorDate(db, {
        userId: user.id,
        word,
        errorDate: date,
      });

      await pool.end();
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return fail(500, e.message);
    }
  },
  zod$({ word: z.string(), input: z.string() }),
);
