import { component$, useSignal } from "@builder.io/qwik";

const labelCls = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
const inputCls =
  "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700";

export const Slider = component$(
  ({
    label,
    name,
    value,
    max,
    cls,
    id,
  }: {
    label: string;
    name: string;
    value: number;
    max: number;
    cls?: string;
    id: string;
  }) => {
    const signal = useSignal<string>(value.toString());

    return (
      <div class={"flex flex-col gap-2 mt-2 " + cls}>
        <label for={name} class={labelCls}>
          {label} ({signal.value} words)
        </label>
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
