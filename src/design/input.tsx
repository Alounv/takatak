import { useVisibleTask$, type Signal, component$, useSignal } from "@builder.io/qwik";

const labelCls = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
const inputCls =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export const AutoFocusedInput = component$(({
  label,
  signal,
  value,
  required,
  placeholder,
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
  name?: string;
  type?: "text" | "number";
  cls?: string;
  innerCls?: string;
  disabled?: boolean;
}) => {
  const inputRef = useSignal<HTMLInputElement>()

  useVisibleTask$(() => {
    inputRef.value?.focus();
  })

  return (
    <Input
      label={label}
      signal={signal}
      value={value}
      required={required}
      placeholder={placeholder}
      autoFocus={true}
      name={name}
      id={id}
      cls={cls}
      innerCls={innerCls}
      type={type}
      disabled={disabled}
      ref={inputRef}
    />
  );
});

export const Input = ({
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
  ref,
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
  ref?: Signal<HTMLInputElement | undefined>;
}) => {
  return (
    <div class={cls + (disabled ? " opacity-50" : "")}>
      {label && (
        <label for={id} class={labelCls}>
          {label + (disabled ? " (disabled)" : "")}
        </label>
      )}
      <input
        ref={ref}
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
};
