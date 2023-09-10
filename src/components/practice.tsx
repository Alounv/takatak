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
import { usePresetAndTrainingWords } from "~/routes/plugin@preset";
import { Analytics } from "./analytics";

export const Practice = component$(() => {
  const indexSignal = useSignal(0);
  const inputSignal = useSignal("");
  const startTime = useSignal(0);
  const lastErrorSignal = useSignal(-1);
  const cachedWords = useSignal<string[]>([]);

  const {
    value: { preset, words = [], nonValidatedAnalytics = [], wordsRepartition },
  } = usePresetAndTrainingWords();

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

  const categories = Object.entries(wordsRepartition || {})
    .filter(([k]) => k !== "total")
    .map(([k, v]) => {
      let color = `bg-sky-${parseInt(k) * 2}00`;
      if (k === "validated") color = "bg-blue-500";
      if (k === "remaining") color = "bg-gray-300";

      const percent = ((v / (wordsRepartition?.total || 1)) * 100).toFixed(0);
      return { key: k, count: v, color, percent };
    });

  return (
    <div class="flex flex-col items-center gap-3">
      <div class="text-lg font-medium">Practice</div>

      <div class="text-gray-500">
        <span>{preset?.name || "None"}</span>
        <span class="mx-2">|</span>
        <span>{preset?.speed || 0} WPM</span>
        <span class="mx-2">|</span>
        <span>{preset?.repetitions || 0} Repetitions</span>
      </div>

      <div class="flex w-full my-4">
        {categories.map(({ key, color, percent, count }, i) => {
          return (
            <div
              key={key}
              class={`flex flex-col border-white border rounded ${color}`}
              style={{ width: `${percent}%` }}
              title={`${key}: ${count}`}
            >
              <span
                class={`text-xs pl-1 ${
                  i % 2 === 0 ? "translate-y-4" : "-translate-y-4"
                }`}
              >
                {count}
              </span>
            </div>
          );
        })}
      </div>
      <div class="text-gray-500 flex w-full gap-1">
        {categories.map(({ key, color }) => {
          return (
            <div key={key} class="flex gap-1">
              <div class={`h-4 w-4 ${color} rounded`} />
              <div class="text-xs font-bold">{key}</div>
            </div>
          );
        })}
      </div>

      <Text
        words={cachedWords.value}
        currentIndex={indexSignal.value}
        hasError={lastErrorSignal.value === indexSignal.value}
      />

      <InputArea index={indexSignal.value} inputSignal={inputSignal} />

      <Analytics words={nonValidatedAnalytics} />
    </div>
  );
});

// bg-sk-100
// bg-sk-200
// bg-sk-300
// bg-sk-400
// bg-sk-500
// bg-sk-600
// bg-sk-700
// bg-sk-800
// bg-sk-900
//
// bg-gray-400
