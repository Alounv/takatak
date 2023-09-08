import { component$, useSignal, $, useOnDocument } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { useAuthSignout } from "~/routes/plugin@auth";
import type { User } from "~/server/db/schema";

export const Profile = component$(({ user }: { user: User }) => {
  const useMenu = useSignal(false);
  const logoutAction = useAuthSignout();

  useOnDocument(
    "click",
    $(async (event) => {
      const menu = document.getElementById("user-menu");
      if (menu) {
        if (!menu.contains(event.target as Node)) {
          useMenu.value = false;
        }
      }
    }),
  );

  return (
    <div class="ml-4 flex items-center md:ml-6">
      <div class="relative ml-3">
        <div>
          <button
            type="button"
            class="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            id="user-menu-button"
            aria-expanded="false"
            aria-haspopup="true"
            onClick$={() => {
              useMenu.value = !useMenu.value;
            }}
          >
            <span class="sr-only">Open user menu</span>
            <img
              class="h-8 w-8 rounded-full"
              src={user.avatar_url || undefined}
              alt=""
            />
          </button>
        </div>

        {useMenu.value && (
          <div
            id="user-menu"
            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
            tabIndex={-1}
          >
            <Form action={logoutAction}>
              <button
                class="text-left w-full px-4 py-2 text-sm font-medium text-gray-700"
                role="menuitem"
                tabIndex={-1}
                id="user-menu-item-2"
              >
                Sign out
              </button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
});
