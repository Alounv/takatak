import {
  component$,
  createContextId,
  useContextProvider,
  useSignal,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { z } from "@builder.io/qwik-city";
import { zod$ } from "@builder.io/qwik-city";
import { routeAction$ } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { DangerSection } from "~/components/danger";
import { Login } from "~/components/login";
import { ObjectiveComponent } from "~/components/objective";
import { ProgressSection } from "~/components/progress";
import { RewardSection } from "~/components/reward";
import { Welcome } from "~/components/welcome";
import {
  createObjective,
  deleteObjective,
  getObjectiveWithSuccessFromUser,
  updateObjective,
} from "~/data/objective";
import { setSuccess } from "~/data/success";
import { getUserFromCookie } from "~/data/user";
import { useGetCurrentUser } from "./layout";
import { Section } from "~/components/section";
import { Encouragement } from "~/components/encouragement";

export default component$(() => {
  const { value: user } = useGetCurrentUser();
  const { value: objective } = useGetUserObjective() || {};
  const refreshEncouragement = useSignal<boolean>(false);
  useContextProvider(RefreshEncouragementContext, refreshEncouragement);

  if (!user) {
    return <Login />;
  }

  if (!objective) {
    return <Welcome />;
  }

  return (
    <div class="text-gray-600">
      <Section title="Objective">
        <ObjectiveComponent objective={objective} />
        <Encouragement objective={objective} />
      </Section>
      <RewardSection objective={objective} />
      <ProgressSection objective={objective} />
      <DangerSection objectiveId={objective.id} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "This is it",
  meta: [
    {
      name: "description",
      content: "This app helps you to achieve your main temporary goal",
    },
  ],
};

export const RefreshEncouragementContext = createContextId<{ value: boolean }>(
  "refresh-encouragement",
);

export const useGetUserObjective = routeLoader$(async ({ cookie }) => {
  const user = await getUserFromCookie(cookie);
  if (user) {
    return getObjectiveWithSuccessFromUser({ userId: user.id });
  }
});

export const useCreateObjective = routeAction$(async (_, { cookie, fail }) => {
  try {
    const user = await getUserFromCookie(cookie);
    if (!user) {
      return { success: false, error: "You must login to create an objective" };
    }
    const objective = await createObjective({ userId: user.id });
    return { success: true, objective };
  } catch (e: any) {
    console.error(e);
    return fail(500, e.message);
  }
});

export const useDeleteObjective = routeAction$(
  async ({ objectiveId }, { fail }) => {
    try {
      await deleteObjective(objectiveId);
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return fail(500, e.message);
    }
  },
  zod$({
    objectiveId: z.string(),
  }),
);

const objectiveEditSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  duration: z.string().optional(),
  daily_saving: z.string().optional(),
  coach: z.string().optional(),
  motivation: z.string().optional(),
  motivation_url: z.string().optional(),
});

export const useEditObjective = routeAction$(async (input, { fail }) => {
  try {
    const { duration: stringDuration, daily_saving, ...rest } = input;
    const duration = stringDuration ? parseInt(stringDuration) : undefined;

    const partialObjective = {
      ...(duration ? { duration } : {}),
      ...(daily_saving
        ? { cost: parseInt(daily_saving) * (duration || 0) }
        : {}),
      ...rest,
    };

    await updateObjective(partialObjective);
    return { success: true };
  } catch (e: any) {
    console.error(e);
    fail(500, e.message);
  }
}, zod$(objectiveEditSchema));

const setSuccessSchema = z.object({
  objectiveId: z.string(),
  isDone: z.boolean(),
  date: z.string(),
});

export const useToggleTodaySuccess = routeAction$(
  async ({ objectiveId, isDone, date }, { fail }) => {
    try {
      await setSuccess({ objectiveId, isDone, date: new Date(date) });
      return { success: true };
    } catch (e: any) {
      console.error(e);
      return fail(500, e.message);
    }
  },
  zod$(setSuccessSchema),
);
