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
import type { Repartition } from "./analytics";
import { Analytics } from "./analytics";
import { Title } from "./practice-title";
import { Confetti } from "~/integrations/react/confetti";
import { SuccessMessage } from "./placeholder";

export const Practice = component$(() => {
  // --- states ---
  const indexSignal = useSignal(0);
  const inputSignal = useSignal("");
  const startTime = useSignal(0);
  const lastErrorSignal = useSignal(-1);
  const previousErrors = useSignal<number[]>([]);
  const cachedWords = useSignal<string[]>([]);
  const cachedWordsRepartition = useSignal<Repartition | undefined>();
  const finishSignal = useSignal(false);

  // --- loaders ---
  const {
    value: { preset, words = [], wordsRepartition, pastRepartition },
  } = usePresetAndTrainingWords();

  // --- actions ---
  const saveResultAction = useSaveData();
  const saveErrorAction = useSaveError();

  useVisibleTask$(() => {
    cachedWords.value = words;
    cachedWordsRepartition.value = wordsRepartition;
  });

  const currentWord = useComputed$(
    () => cachedWords.value?.[indexSignal.value],
  );

  const hasError = !getIsMatching({
    target: currentWord.value,
    input: inputSignal.value,
  });

  useVisibleTask$(({ track }) => {
    track(() => lastErrorSignal.value);
    previousErrors.value = [...previousErrors.value, indexSignal.value];
  });

  useVisibleTask$(({ track }) => {
    const input = track(() => inputSignal.value);
    const index = track(() => indexSignal.value);
    // first letter typed
    if (index === 0 && input.length === 1) {
      startTime.value = Date.now();
    }
  });

  useVisibleTask$(({ track }) => {
    if (!currentWord.value) {
      finishSignal.value = true;
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
        <Confetti client: load onFinish$={() => window.location.reload()} />
      )}

      <Title preset={preset} />

      <Analytics
        pastWordsRepartition={pastRepartition}
        wordsRepartition={
          finishSignal.value ? wordsRepartition : cachedWordsRepartition.value
        }
      />

      {cachedWords.value.length <= 1 ? (
        <SuccessMessage />
      ) : (
        <Text
          words={cachedWords.value}
          previousErrors={previousErrors.value}
          currentIndex={indexSignal.value}
          hasError={hasError}
          input={preset?.highlightLetter ? inputSignal.value : undefined}
        />
      )}

      <InputArea
        inputSignal={inputSignal}
        ignoresSimpleBackspaces={preset?.forbidSimpleLetterBackspace ?? false}
      />
    </div>
  );
});
