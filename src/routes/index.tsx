import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Login } from "~/components/login";
import { useGetCurrentUser } from "./layout";
import { Practice } from "~/components/practice";

export default component$(() => {
  const { value: user } = useGetCurrentUser();

  if (!user) {
    return <Login />;
  }

  return <Practice />;
});

export const head: DocumentHead = {
  title: "Takatak",
  meta: [
    {
      name: "description",
      content:
        "Takatak helps you improve typing speed and accuracy by showing you incremental progress.",
    },
  ],
};
