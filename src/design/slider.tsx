import { component$, useSignal } from "@builder.io/qwik";

const labelCls = "block text-sm font-medium text-gray-900 dark:text-white";
const inputCls =
  "mt-1 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700";

export const Slider = component$(
  ({
    label,
    description,
    name,
    value,
    max,
    cls,
    id,
  }: {
    label: string;
    description?: string;
    name: string;
    value: number;
    max: number;
    cls?: string;
    id: string;
  }) => {
    const signal = useSignal<string>(value.toString());

    return (
      <div class={"flex flex-col gap-1 mt-2 " + cls}>
        <label for={name} class={labelCls}>
          {label} ({signal.value} words)
        </label>
        {description && <p class="text-sm text-gray-500">{description}</p>}
        <input
          id={id}
          name={name}
          type="range"
          bind: value={signal}
          class={inputCls}
          min="0"
          max={max}
        />
      </div>
    );
  },
);
