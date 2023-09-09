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

  const {
    value: { preset, words = [], nonValidatedAnalytics = [], progress = 0 },
  } = usePresetAndTrainingWords();
  const currentWord = useComputed$(() => words[indexSignal.value]);

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

      <div class="text-gray-500">
        <span>Progress {Math.round(progress * 100)} %</span>
      </div>

      <Text
        words={words}
        currentIndex={indexSignal.value}
        hasError={lastErrorSignal.value === indexSignal.value}
      />

      <InputArea index={indexSignal.value} inputSignal={inputSignal} />

      <Analytics words={nonValidatedAnalytics} />
    </div>
  );
});
