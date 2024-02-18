const labelCls = "relative inline-flex items-center cursor-pointer";
const divCls =
  "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 dark:peer-focus:ring-sky-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-sky-600";
const spanCls = "ml-3 text-sm font-medium text-gray-900 dark:text-gray-300";

export const Toggle = ({
  label,
  description,
  name,
  checked,
  cls,
}: {
  label: string;
  description?: string;
  name: string;
  checked: boolean;
  cls?: string;
}) => {
  return (
    <div>
      <label class={labelCls + " " + cls}>
        <input
          type="checkbox"
          name={name}
          checked={checked}
          class="sr-only peer"
        />
        <div class={divCls}></div>
        <span class={spanCls}>{label}</span>
      </label>

      {description && <p class="text-sm text-gray-500">{description}</p>}
    </div>
  );
};
