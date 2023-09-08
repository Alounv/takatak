import { component$ } from "@builder.io/qwik";
import { Profile } from "./profile";
import { useGetCurrentUser } from "~/routes/layout";
import { Logo } from "./logo";

const Start = component$(() => {
  return (
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <a href="/" title="takatak" class="flex items-center gap-3">
          <Logo />
          <div class="text-white font-medium text-lg">Taka-ta-tak</div>
        </a>
      </div>

      <div class="ml-5 flex items-baseline space-x-4">
        <a
          href="https://github.com/Alounv/takatak"
          target="_blank"
          class="text-gray-400 hover:bg-gray-700 hover:text-white rounded-md px-2 py-2 text-sm"
        >
          Github
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
