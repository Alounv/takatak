import {
  component$,
  useContext,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Editable } from "./editable";
import { RefreshEncouragementContext, useEditObjective } from "~/routes";
import { useGetCurrentUser } from "~/routes/layout";
import type { Objective, Success } from "~/server/db/schema";
import { getEncouragement } from "~/utilities/encouragement";

interface IEncouragement {
  objective: Objective & { success: Success[] };
}

export const Encouragement = component$(({ objective }: IEncouragement) => {
  const { value: user } = useGetCurrentUser();
  const editAction = useEditObjective();
  const refresh = useContext(RefreshEncouragementContext);
  const ref = useSignal<HTMLElement>();

  useVisibleTask$(async ({ track, cleanup }) => {
    track(refresh);

    if (!user) return;
    const { coach, description, duration, motivation, success } =
      objective || {};

    ref.value!.textContent = "";
    const controller = new AbortController();
    cleanup(() => controller.abort());

    getEncouragement({
      controller,
      objective: { coach, description, duration, motivation },
      successCount: success.length,
      name: user.name || "user",
      onData: (data) => {
        if (data === "[DONE]") return;
        ref.value!.textContent = ref.value?.textContent + data;
      },
    });
  });

  return (
    <Form action={editAction} class="flex flex-col">
      <input type="hidden" name="id" value={objective.id} />
      <div class="mt-12">
        <div class="flex flex-wrap gap-2 items-center">
          <div class="flex-shrink-0">Coached by: </div>
          <Editable
            classes="font-medium text-gray-800 w-80 flex-shrink-0"
            name="coach"
            value={objective.coach}
          />
          <div class="flex-grow" />
          <button
            class="rounded-lg text-white bg-sky-600 text-sm py-1 px-2 hover:bg-sky-500 shadow hover:shadow-none"
            onClick$={() => {
              refresh.value = !refresh.value;
            }}
          >
            new encouragement
          </button>
        </div>
        <div class="rounded-xl p-2 sm:p-8 bg-gray-50 border mt-2 text-lg ">
          <div
            ref={ref}
            class="text-grey-700 text-2xl font-medium opacity-80 text-sky-700"
          >
            {"Loading..."}
          </div>
        </div>
      </div>
    </Form>
  );
});
