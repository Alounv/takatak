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
import { useSelectedPreset } from "~/routes/plugin@preset";
import { Analytics } from "./analytics";
import { useValidatedWords } from "~/routes/plugin@analytics";

export const Practice = component$(() => {
  const indexSignal = useSignal(0);
  const inputSignal = useSignal("");
  const startTime = useSignal(0);
  const lastErrorSignal = useSignal(-1);
  const selectedPreset = useSelectedPreset();
  const currentPreset = selectedPreset.value.data;

  const analytics = useValidatedWords();
  const measuredWords = analytics.value.data || [];
  const validatedWords = currentPreset
    ? measuredWords
        .filter((x) => x.speed >= currentPreset?.speed)
        .map((x) => x.word)
    : [];

  const presetWords = (currentPreset?.text || "").split(" ");
  const nonValidatedWords = presetWords.filter(
    (x) => !validatedWords.includes(x),
  );

  const words = useComputed$(() => {
    const shuffled = nonValidatedWords.sort(() => Math.random() - 0.5);
    return [" ", ...shuffled];
  });

  const currentWord = useComputed$(() => {
    return words.value[indexSignal.value];
  });

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

      <div class="text-gray-500">{currentPreset?.name || "None"}</div>

      <Text
        words={words.value}
        currentIndex={indexSignal.value}
        hasError={lastErrorSignal.value === indexSignal.value}
      />

      <InputArea index={indexSignal.value} inputSignal={inputSignal} />

      <Analytics
        words={measuredWords.filter((w) => nonValidatedWords.includes(w.word))}
      />
    </div>
  );
});
