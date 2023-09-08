import { routeAction$, z, zod$ } from "@builder.io/qwik-city";
import {
  createPreset,
  deletePreset,
  listUserPresets,
  selectPreset,
  updatePreset,
} from "~/data/preset";
import { getUserFromCookie } from "~/data/user";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useCreateEmptyPreset = routeAction$(
  async ({ name }, { cookie, fail }) => {
    try {
      const user = await getUserFromCookie(cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to create preset",
        };
      }
      await createPreset({
        userId: user.id,
        name,
        text: "",
        sessionLength: 100,
        speed: 30,
        repetitions: 3,
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
    { id, name, text, sessionLength, speed, repetitions },
    { cookie, fail },
  ) => {
    try {
      const user = await getUserFromCookie(cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to update preset",
        };
      }
      await updatePreset({
        id,
        userId: user.id,
        name,
        text,
        ...(sessionLength && { sessionLength: parseInt(sessionLength) }),
        ...(speed && { speed: parseInt(speed) }),
        ...(repetitions && { repetitions: parseInt(repetitions) }),
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
  }),
);

export const useListPresets = routeLoader$(async ({ cookie }) => {
  const user = await getUserFromCookie(cookie);
  if (!user) {
    return {
      success: false,
      error: "You must login to list presets",
    };
  }

  const presets = await listUserPresets(user.id);
  return {
    success: true,
    data: presets,
  };
});

export const useSelectPreset = routeAction$(
  async ({ id }, { cookie, fail }) => {
    try {
      const user = await getUserFromCookie(cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to select preset",
        };
      }
      await selectPreset({ userId: user.id, presetId: id });
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
      const user = await getUserFromCookie(cookie);
      if (!user) {
        return {
          success: false,
          error: "You must login to delete preset",
        };
      }
      await deletePreset(id);
    } catch (e: any) {
      console.error(e);
      fail(500, e.message);
    }
  },
  zod$({ id: z.string() }),
);
