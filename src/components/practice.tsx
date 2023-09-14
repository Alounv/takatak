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
import { Title } from "./practice-title";
import { Confetti } from "~/integrations/react/confetti";

export const Practice = component$(() => {
  // --- states ---
  const indexSignal = useSignal(0);
  const inputSignal = useSignal("");
  const startTime = useSignal(0);
  const lastErrorSignal = useSignal(-1);
  const cachedWords = useSignal<string[]>([]);
  const finishSignal = useSignal(false);

  // --- loaders ---
  const {
    value: { preset, words = [], wordsRepartition },
  } = usePresetAndTrainingWords();

  // --- actions ---
  const saveResultAction = useSaveData();
  const saveErrorAction = useSaveError();

  useVisibleTask$(() => {
    cachedWords.value = words;
  });

  const currentWord = useComputed$(
    () => cachedWords.value?.[indexSignal.value],
  );

  const hasError = !getIsMatching({
    target: currentWord.value,
    input: inputSignal.value,
  });

  useVisibleTask$(({ track }) => {
    if (!currentWord.value) {
      finishSignal.value = true;
      // window.location.reload();
      return;
    }

    const isFinished = track(() => {
      return inputSignal.value === currentWord.value + " ";
    });

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
    <div class="flex flex-col gap-10">
      {finishSignal.value && (
        <Confetti client:load onFinish$={() => window.location.reload()} />
      )}

      <Title preset={preset} />

      <Analytics wordsRepartition={wordsRepartition} />

      <Text
        words={cachedWords.value}
        currentIndex={indexSignal.value}
        hasError={hasError}
        input={preset?.highlightLetter ? inputSignal.value : undefined}
      />

      <InputArea index={indexSignal.value} inputSignal={inputSignal} />
    </div>
  );
});
