import { Link } from "@builder.io/qwik-city";
import { Settings } from "./logo";
import { LINK_STYLE } from "./nav";

export const SuccessMessage = () => (
  <div class="text-center mb-6 flex flex-col items-center gap-2">
    <span>All words are validated 🎉</span>

    <span class="text-sm text-gray-400">
      You can now increase the speed, the repetition or the corpus size.
    </span>

    <div class="ml-2 flex items-baseline space-x-4">
      <Link href="/settings" class={`${LINK_STYLE} flex gap-2 items-center`}>
        <Settings />
        Settings
      </Link>
    </div>
  </div>
);
