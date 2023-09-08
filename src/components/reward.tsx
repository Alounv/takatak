import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Editable } from "./editable";
import { Section } from "./section";
import { useEditObjective } from "~/routes";
import type { Objective, Success } from "~/server/db/schema";

interface IRewardSection {
  objective: Objective & { success: Success[] };
}

export const RewardSection = component$(({ objective }: IRewardSection) => {
  const editAction = useEditObjective();
  const { motivation, motivation_url, duration, cost, success } = objective;

  const progress = success.length / duration;

  return (
    <Section title="Reward">
      <Form
        action={editAction}
        class="flex flex-col-reverse sm:flex-row justify-center items-center"
      >
        <input type="hidden" name="id" value={objective.id} />
        <div class="w-full sm:w-1/2 flex flex-col gap-6 items-center justify-center">
          <div class="relative h-20 flex items-center justify-stretch p-8 my-3 py-14 rounded-xl overflow-hidden bg-gray-100 shadow-inner w-full sm:w-56">
            <div
              class="bg-sky-500 h-full w-full absolute top-0 left-0 bottom-0"
              style={`width: ${progress * 100}%`}
            />
            <div class="text-5xl relative font-semibold text-gray-800 w-full text-center">{`${Math.round(
              cost * progress,
            )} €`}</div>
          </div>
          <div class="text-gray-400">{`already saved (${Math.round(
            progress * 100,
          )} %)`}</div>
        </div>

        <div class="flex flex-col flex-1 p-2 items-center">
          <div class="mb-4">
            <Editable
              rows={3}
              classes="text-lg font-medium mb-4 text-gray-800"
              name="motivation"
              value={motivation}
            />
            <span class="text-gray-400 text-sm">{` (${cost} €)`}</span>
          </div>
          <div class="rounded-xl shadow drop-shadow-lg p-4 bg-gray-50 overflow-hidden mb-2">
            <img class="rounded-md" src={motivation_url} alt={motivation} />
            <div class="absolute top-0 bottom-0 left-0 right-0 opacity-25 bg-white" />
          </div>
          <Editable
            rows={4}
            classes="text-sm rounded text-gray-400"
            label="change URL"
            name="motivation_url"
            value={motivation_url}
          />
        </div>
      </Form>
    </Section>
  );
});
