import { useVisibleTask$, type Signal, component$, useSignal } from "@builder.io/qwik";

const labelCls = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
const inputCls =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export const Input = component$(({
  label,
  signal,
  value,
  required,
  placeholder,
  autoFocus = false,
  name,
  id,
  cls,
  innerCls,
  type = "text",
  disabled = false,
}: {
  id: string;
  label?: string;
  signal?: Signal;
  value?: string | number;
  placeholder?: string;
  required?: boolean;
  autoFocus?: boolean;
  name?: string;
  type?: "text" | "number";
  cls?: string;
  innerCls?: string;
  disabled?: boolean;
}) => {
  const inputRef = useSignal<HTMLInputElement>()
  useVisibleTask$(() => {
    if (autoFocus) {
      inputRef.value?.focus();
    }
  })
  return (
    <div class={cls + (disabled ? " opacity-50" : "")}>
      {label && (
        <label for={id} class={labelCls}>
          {label + (disabled ? " (disabled)" : "")}
        </label>
      )}
      <input
        ref={inputRef}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        name={name}
        id={id}
        class={inputCls + " " + innerCls}
        bind: value={signal}
        autoFocus={autoFocus}
      />
    </div>
  );
});
