import { component$, Slot } from "@builder.io/qwik";

import { Nav } from "~/components/nav";

export default component$(() => {
  return (
    <div class="min-h-full bg-white sm:bg-transparent">
      <Nav />
      <main>
        <div class="mx-auto max-w-4xl sm:p-8">
          <div
            class="
          py-6 px-6 sm:px-8 lg:px-12 xl:px-16 overflow-hidden
          bg-white dark:bg-gray-900 text-black dark:text-white
          sm:shadow rounded-lg min-h-full
          "
          >
            <Slot />
          </div>
        </div>
      </main>
    </div>
  );
});
