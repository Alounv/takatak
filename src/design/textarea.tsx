const labelCls = "block text-sm font-medium text-gray-900 dark:text-white";
const inputCls =
  "mt-1 mb-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export const TextArea = ({
  label,
  description,
  value,
  name,
  id,
  cls,
  rows = 3,
  disabled = false,
}: {
  id: string;
  label?: string;
  description?: string;
  value?: string | number;
  name?: string;
  cls?: string;
  rows?: number;
  disabled?: boolean;
}) => {
  return (
    <div class={cls + (disabled ? " opacity-50" : "")}>
      {label && (
        <label for={id} class={labelCls}>
          {label + (disabled ? " (disabled)" : "")}
        </label>
      )}
      {description && <p class="text-sm text-gray-500">{description}</p>}
      <textarea
        value={value}
        disabled={disabled}
        name={name}
        id={id}
        class={inputCls}
        rows={rows}
      />
    </div>
  );
};
