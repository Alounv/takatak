import { component$ } from "@builder.io/qwik";

import { Form } from "@builder.io/qwik-city";
import { Button } from "~/design/button";
import { useAuthSignin } from "~/routes/plugin@auth";

export const Login = component$(() => {
  const loginAction = useAuthSignin();

  return (
    <div class="flex flex-col gap-8 items-center py-6">
      <div>You must login (with a github account) to create an objective</div>
      <Form action={loginAction}>
        <input type="hidden" name="providerId" value="github" />
        <div class="login">
          <Button type="submit">Login</Button>
        </div>
      </Form>
    </div>
  );
});
