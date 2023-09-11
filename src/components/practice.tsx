import {
  component$,
  useComputed$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Text } from "./text";
import { InputArea } from "./input";
import { getIsMatching } from "~/utils";
import { useSaveData, useSaveError } from "~/routes/plugin@save";
import {
  useAnalyticsForYesterday,
  usePresetAndTrainingWords,
} from "~/routes/plugin@preset";

export const Practice = component$(() => {
  const indexSignal = useSignal(0);
  const inputSignal = useSignal("");
  const startTime = useSignal(0);
  const lastErrorSignal = useSignal(-1);
  const cachedWords = useSignal<string[]>([]);

  const {
    value: { preset, words = [], wordsRepartition },
  } = usePresetAndTrainingWords();

  const {
    value: { wordsRepartition: yesterdayWordsRepartition },
  } = useAnalyticsForYesterday();

  useVisibleTask$(() => {
    cachedWords.value = words;
  });

  const currentWord = useComputed$(
    () => cachedWords.value?.[indexSignal.value],
  );

  const saveResultAction = useSaveData();
  const saveErrorAction = useSaveError();

  useVisibleTask$(({ track }) => {
    const isFinished = track(
      () => inputSignal.value === currentWord.value + " ",
    );

    if (isFinished) {
      if (currentWord.value !== " ") {
        const duration = Date.now() - startTime.value;
        saveResultAction.submit({
          duration,
          word: currentWord.value,
        });
      }

      // Reset state
      inputSignal.value = "";
      indexSignal.value++;
      startTime.value = Date.now();

      return;
    }

    const hasError = track(
      () =>
        !getIsMatching({ target: currentWord.value, input: inputSignal.value }),
    );

    if (!hasError) return;

    if (lastErrorSignal.value !== indexSignal.value) {
      if (currentWord.value !== " ") {
        saveErrorAction.submit({
          word: currentWord.value,
          input: inputSignal.value,
        });
        lastErrorSignal.value = indexSignal.value;
      }
    }
  });

  const categories = getCategories(wordsRepartition);

  return (
    <div class="flex flex-col gap-8">
      <div class="flex items-center gap-4">
        <div class="text-lg font-medium">Practice</div>
        <div class="text-gray-500">
          <span>{preset?.name || "None"}</span>
          <span class="mx-2">|</span>
          <span>{preset?.speed || 0} WPM</span>
          <span class="mx-2">|</span>
          <span>{preset?.repetitions || 0} Repetitions</span>
        </div>
      </div>

      <div>
        {yesterdayWordsRepartition && (
          <Analytics
            repartition={yesterdayWordsRepartition}
            title={`Yesterday`}
          />
        )}
        {wordsRepartition && (
          <Analytics repartition={wordsRepartition} title={`Today`} />
        )}
        <div class="mt-3 flex flex-col gap-3">
          <div class="text-sm font-medium">Today's progress</div>
          <div class="text-gray-500 flex flex-col gap-1">
            {yesterdayWordsRepartition &&
              categories
                .filter((c) => c.key !== "remaining")
                .map(({ key, color, count }) => {
                  const yesterdayCount =
                    yesterdayWordsRepartition?.[key as "total"] || 0;

                  const diff = count - yesterdayCount;
                  const percent = (
                    (diff / (wordsRepartition?.total || 1)) *
                    100
                  ).toFixed(0);
                  return (
                    <div key={key} class="flex gap-3">
                      <div class="text-xs font-bold w-20 text-right">
                        ({key})
                      </div>
                      <div
                        class={`h-4 w-4 ${color} rounded`}
                        style={{ width: percent + "%" }}
                      />
                      <div class="text-xs">{diff}</div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>

      <Text
        words={cachedWords.value}
        currentIndex={indexSignal.value}
        hasError={lastErrorSignal.value === indexSignal.value}
      />

      <InputArea index={indexSignal.value} inputSignal={inputSignal} />
    </div>
  );
});

interface Repartition extends Record<string, number> {
  total: number;
  validated: number;
  remaining: number;
}

const Analytics = ({
  title,
  repartition,
}: {
  repartition: Repartition;
  title: string;
}) => {
  const categories = getCategories(repartition);
  return (
    <div class="flex items-center gap-4">
      <div class="text-sm w-20 font-medium">{title}</div>
      <div class="flex w-full my-3">
        {categories.map(({ key, color, percent, count }, i) => {
          return (
            <div
              key={key}
              class={`flex flex-col border-white border rounded ${color}`}
              style={{ width: `${percent}%` }}
              title={`${key}: ${count}`}
            >
              {count > 0 && (
                <span
                  class={`text-xs pl-1 ${
                    i % 2 === 0 ? "translate-y-4" : "-translate-y-4"
                  }`}
                >
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getCategoryColor = (k: string) => {
  if (k === "validated") return "bg-sky-500";
  if (k === "remaining") return "bg-gray-200";

  const parsed = parseInt(k);
  if (parsed >= 0) return `bg-pink-${parsed + 1}00`;
};

const getCategories = (repartition: Repartition | undefined) => {
  if (!repartition) return [];

  return Object.entries(repartition || {})
    .filter(([k]) => k !== "total")
    .map(([k, v]) => {
      const color = getCategoryColor(k);
      const percent = ((v / (repartition?.total || 1)) * 100).toFixed(0);
      return { key: k, count: v, color, percent };
    });
};

// bg-pink-100
// bg-pink-200
// bg-pink-300
// bg-pink-400
// bg-pink-500
// bg-pink-600
// bg-pink-700
// bg-pink-800
// bg-pink-900
