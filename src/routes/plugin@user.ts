import { routeLoader$ } from "@builder.io/qwik-city";
import { getUserFromCookie } from "~/data/user";

export const useGetCurrentUser = routeLoader$(async ({ cookie }) => {
  return getUserFromCookie(cookie);
});
