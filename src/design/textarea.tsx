const labelCls = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
const inputCls =
  "block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

export const TextArea = ({
  label,
  value,
  name,
  id,
  cls,
  rows = 3,
}: {
  id: string;
  label?: string;
  value?: string | number;
  name?: string;
  cls?: string;
  rows?: number;
}) => {
  return (
    <div class={cls}>
      {label && (
        <label for={id} class={labelCls}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        name={name}
        id={id}
        class={inputCls}
        rows={rows}
      />
    </div>
  );
};
