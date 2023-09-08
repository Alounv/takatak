import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Editable } from "./editable";
import { useEditObjective } from "~/routes";
import type { Objective } from "~/server/db/schema";
import type { Success } from "~/server/db/schema";

interface IObjective {
  objective: Objective & { success: Success[] };
}

export const ObjectiveComponent = component$(({ objective }: IObjective) => {
  const editAction = useEditObjective();
  const { description, duration, cost } = objective;
  const dailySaving = Math.round(cost / duration);

  return (
    <Form action={editAction} class="flex flex-col">
      <input type="hidden" name="id" value={objective.id} />
      <Editable
        classes="text-4xl font-bold text-gray-800"
        name="description"
        value={description}
      />
      <div class="mt-6">
        <span class="text-lg">
          For{" "}
          <Editable
            classes="font-medium text-gray-800 pl-1"
            name="duration"
            type="number"
            value={duration.toString()}
          />{" "}
          days, save{" "}
          <Editable
            classes="font-medium text-gray-800 pl-1"
            type="number"
            name="daily_saving"
            value={dailySaving.toString()}
          />{" "}
          € on each success.
        </span>
      </div>
    </Form>
  );
});
