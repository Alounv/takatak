import { component$, useContext } from "@builder.io/qwik";
import { useToggleTodaySuccess } from "~/routes";
import { RefreshEncouragementContext } from "~/routes";

interface ISuccess {
  isPassed: boolean;
  isFailed: boolean;
  isEditable: boolean;
  date: Date;
  objectiveId: string;
}

export const SuccessCheckbox = component$(
  ({ isPassed, isFailed, date, objectiveId, isEditable }: ISuccess) => {
    const successAction = useToggleTodaySuccess();
    const action = isEditable ? successAction : undefined;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const refreshEncouragement = useContext(RefreshEncouragementContext);

    return (
      <div class="flex-shrink-0 flex flex-col items-center gap-2">
        <label class="text-sm text-gray-400 cursor-pointer" for="today">
          <strong class="text-gray-600">{day}</strong> / <span>{month}</span>
        </label>
        <input
          id="today"
          type="checkbox"
          disabled={!action}
          checked={isPassed}
          class={`h-8 w-8 rounded disabled:border-gray-300 border-gray-500 text-sky-600 disabled:text-sky-500 focus:ring-sky-600 ${
            isFailed ? " bg-gray-300" : ""
          } ${!action ? "" : " shadow-lg drop-shadow-lg"}}`}
          onChange$={async (event) => {
            // eslint-disable-next-line qwik/valid-lexical-scope
            await action?.submit({
              objectiveId,
              date: date.toString(),
              isDone: event.target.checked,
            });
            refreshEncouragement.value = !refreshEncouragement.value;
          }}
        />
      </div>
    );
  },
);
