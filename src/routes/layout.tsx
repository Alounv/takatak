import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

import { Nav } from "~/components/nav";
import { getUserFromCookie } from "~/data/user";

export const useGetCurrentUser = routeLoader$(async ({ cookie }) => {
  return getUserFromCookie(cookie);
});

export default component$(() => {
  return (
    <div class="min-h-full bg-white sm:bg-transparent">
      <Nav />
      <main>
        <div class="mx-auto max-w-4xl sm:p-8">
          <div class="py-6 px-6 sm:px-8 lg:px-12 xl:px-16 overflow-hidden bg-white sm:shadow rounded-lg min-h-full">
            <Slot />
          </div>
        </div>
      </main>
    </div>
  );
});
