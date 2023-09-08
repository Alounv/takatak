import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import {
  createPreset,
  deletePreset,
  getPreset,
  listUserPresets,
  selectPreset,
  updatePreset,
} from "~/data/preset";
import { getUserFromCookie } from "~/data/user";
import { routeLoader$ } from "@builder.io/qwik-city";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { dbConfig } from "~/server/db/client";

export const useCreateEmptyPreset = routeAction$(
  async ({ name }, { cookie, fail }) => {
    try {
      const pool = new Pool(dbConfig);
      const db = drizzle(pool);

      const user = await getUserFromCookie(db, cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to create preset",
        };
      }
      await createPreset(db, {
        userId: user.id,
        name,
        text: "",
        sessionLength: 100,
        speed: 30,
        repetitions: 3,
      });

      await pool.end();
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
    { id, name, text, sessionLength, speed, repetitions },
    { cookie, fail },
  ) => {
    try {
      const pool = new Pool(dbConfig);
      const db = drizzle(pool);

      const user = await getUserFromCookie(db, cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to update preset",
        };
      }
      await updatePreset(db, {
        id,
        userId: user.id,
        name,
        text,
        ...(sessionLength && { sessionLength: parseInt(sessionLength) }),
        ...(speed && { speed: parseInt(speed) }),
        ...(repetitions && { repetitions: parseInt(repetitions) }),
      });

      await pool.end();
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
  }),
);

export const useListPresets = routeLoader$(async ({ cookie }) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const user = await getUserFromCookie(db, cookie);
  if (!user) {
    return {
      success: false,
      error: "You must login to list presets",
    };
  }

  const presets = await listUserPresets(db, user.id);

  await pool.end();
  return {
    success: true,
    data: presets,
  };
});

export const useSelectedPreset = routeLoader$(async ({ cookie }) => {
  const pool = new Pool(dbConfig);
  const db = drizzle(pool);

  const user = await getUserFromCookie(db, cookie);
  if (!user) {
    return {
      success: false,
      error: "You must login to get preset",
    };
  }

  if (!user.selectedPresetId) {
    return {
      success: true,
      error: "No preset selected",
    };
  }

  const preset = await getPreset(db, user.selectedPresetId);
  return {
    success: true,
    data: preset,
  };
});

export const useSelectPreset = routeAction$(
  async ({ id }, { cookie, fail }) => {
    try {
      const pool = new Pool(dbConfig);
      const db = drizzle(pool);

      const user = await getUserFromCookie(db, cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to select preset",
        };
      }
      await selectPreset(db, { userId: user.id, presetId: id });

      await pool.end();
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
      const pool = new Pool(dbConfig);
      const db = drizzle(pool);

      const user = await getUserFromCookie(db, cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to delete preset",
        };
      }

      await pool.end();
      await deletePreset(db, id);
    } catch (e: any) {
      console.error(e);
      fail(500, e.message);
    }
  },
  zod$({ id: z.string() }),
);
