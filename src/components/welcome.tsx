import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useCreateObjective } from "~/routes";
import { useAuthSession } from "~/routes/plugin@auth";

export const Welcome = component$(() => {
  const createAction = useCreateObjective();
  const userSignal = useAuthSession();
  const { user } = userSignal.value || {};

  return (
    <div class="flex flex-col items-center gap-3">
      <div>{`Welcome ${user?.name}`}</div>
      <div>What is your main objective now?</div>
      <Form action={createAction}>
        <button class="inline-flex justify-center rounded-lg text-sm font-semibold py-2.5 px-4 bg-slate-900 text-white hover:bg-slate-700">
          Create my objective
        </button>
      </Form>
    </div>
  );
});
