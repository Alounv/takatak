import { component$ } from "@builder.io/qwik";
import { useAuthSession } from "~/routes/plugin@auth";

export const Welcome = component$(() => {
  const userSignal = useAuthSession();
  const { user } = userSignal.value || {};

  return (
    <div class="flex flex-col items-center gap-3">
      <div>{`Welcome ${user?.name}`}</div>
      <div>Hello</div>
    </div>
  );
});
