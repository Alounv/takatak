import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Section } from "./section";
import { useDeleteObjective } from "~/routes";

interface IDangerSection {
  objectiveId: string;
}

export const DangerSection = component$(({ objectiveId }: IDangerSection) => {
  const deleteAction = useDeleteObjective();
  return (
    <Section title="Danger">
      <details class="rounded-lg bg-gray-50 p-6">
        <summary class="text-sm text-gray-400 cursor-pointer">open</summary>
        <Form
          action={deleteAction}
          class="flex flex-col sm:flex-row mb-4 items-center justify-center gap-4"
        >
          <input type="hidden" name="objectiveId" value={objectiveId} />

          <button class="mt-2 rounded-lg text-sm font-semibold py-2.5 px-4 bg-red-600 text-white hover:bg-red-700">
            Delete objective
          </button>
          <div class="text-sm text-red-400">⚠️ cannot be reversed</div>
        </Form>
      </details>
    </Section>
  );
});
