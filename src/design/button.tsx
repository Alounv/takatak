import type { PropFunction } from "@builder.io/qwik";
import { Slot, component$ } from "@builder.io/qwik";

const base = "text-sm font-medium text-center rounded-lg";

const standardColor =
  "text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800";

const secondaryColor =
  "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800";

export const Button = component$(
  ({
    onClick$,
    disabled,
    type = "button",
    isSecondary,
    small,
    cls,
  }: {
    disabled?: boolean;
    onClick$?: PropFunction;
    type?: "button" | "submit" | "reset";
    isSecondary?: boolean;
    small?: boolean;
    cls?: string;
  }) => {
    return (
      <button
        class={
          base +
          " " +
          (isSecondary ? secondaryColor : standardColor) +
          " " +
          (small ? "px-2 py-1" : "px-3 py-2") +
          " " +
          cls
        }
        type={type}
        onClick$={onClick$}
        disabled={disabled}
      >
        <Slot />
      </button>
    );
  },
);
