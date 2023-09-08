import { component$ } from "@builder.io/qwik";

import { Form } from "@builder.io/qwik-city";
import { useAuthSignin } from "~/routes/plugin@auth";

export const Login = component$(() => {
  const loginAction = useAuthSignin();

  return (
    <div class="flex flex-col gap-8 items-center py-6">
      <div>You must login (with a github account) to create an objective</div>
      <Form action={loginAction}>
        <input type="hidden" name="providerId" value="github" />
        <div class="login">
          <button
            type="submit"
            class="rounded-lg text-sm font-semibold py-1.5 px-4 bg-gray-600 text-white hover:bg-gray-700"
          >
            Login
          </button>
        </div>
      </Form>
    </div>
  );
});
