import { component$ } from "@builder.io/qwik";
import { Profile } from "./profile";
import { Logo, Settings } from "./logo";
import { useGetCurrentUser } from "~/routes/plugin@user";
import { Link } from "@builder.io/qwik-city";

export const LINK_STYLE =
  "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm";

const Start = component$(() => {
  return (
    <div class="flex items-center flex-1">
      <div class="flex-shrink-0">
        <Link
          href="/"
          title="takatak"
          class={`${LINK_STYLE} flex items-center gap-3 py-0 pl-0`}
        >
          <Logo />
          <div class="text-white font-medium text-lg">Taka-ta-tak</div>
        </Link>
      </div>

      <div class="ml-2 flex items-baseline space-x-4">
        <Link href="/settings" class={`${LINK_STYLE} flex gap-2 items-center`}>
          <Settings />
          Settings
        </Link>
      </div>

      <div class="ml-auto flex items-baseline space-x-4">
        <a
          href="https://github.com/Alounv/takatak"
          target="_blank"
          class={LINK_STYLE}
        >
          github
        </a>
      </div>
    </div>
  );
});

export const Nav = component$(() => {
  const { value: user } = useGetCurrentUser();
  return (
    <nav class="bg-gray-800 sticky top-0 z-10">
      <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <Start />
          {user && <Profile user={user} />}
        </div>
      </div>
    </nav>
  );
});
