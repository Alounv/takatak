import { component$, useSignal, useTask$ } from "@builder.io/qwik";

interface IEditable {
  value: string;
  classes: string;
  rows?: number;
  label?: string;
  name: string;
  type?: string;
}

export const Editable = component$(
  ({ value, classes, rows, label, name, type }: IEditable) => {
    const useIsEdited = useSignal(false);
    const isEdited = useIsEdited.value;
    const inputRef = useSignal<HTMLInputElement>();
    const submitRef = useSignal<HTMLButtonElement>();

    useTask$(({ track }) => {
      track(() => useIsEdited.value);
      if (!useIsEdited.value) return;

      setTimeout(() => {
        const input = inputRef.value;
        input?.focus?.();
      }, 50);
    });

    const inputCls =
      classes +
      " border border-gray-400 rounded px-2" +
      (rows ? " resize-none w-full" : " ");

    const spanCls =
      classes +
      " cursor-pointer hover:bg-yellow-100 hover:border-b border-yellow-400 rounded";

    const Element = rows ? "textarea" : "input";

    return (
      <>
        <Element
          ref={inputRef}
          name={name}
          type={type}
          class={isEdited ? inputCls : "hidden"}
          value={value}
          rows={rows}
          onBlur$={() => {
            useIsEdited.value = false;
            submitRef.value?.click();
          }}
        />
        <span
          class={isEdited ? "hidden" : spanCls}
          onClick$={() => {
            useIsEdited.value = true;
          }}
        >
          {label || value || "Click to edit"}
        </span>
        <button type="submit" class="hidden" ref={submitRef} />
      </>
    );
  },
);
