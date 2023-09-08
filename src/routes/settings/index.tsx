import { component$ } from "@builder.io/qwik";
import { Login } from "~/components/login";
import { useGetCurrentUser } from "../plugin@user";
import { Settings } from "~/components/settings";

export default component$(() => {
  const { value: user } = useGetCurrentUser();

  if (!user) {
    return <Login />;
  }

  return <Settings />;
});
