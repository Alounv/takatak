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
  const indexSignal = useSignal(-1);
  const inputSignal = useSignal("");
  const startTime = useSignal(0);
  const lastErrorSignal = useSignal(-1);
  const previousErrors = useSignal<number[]>([]);
  const cachedWords = useSignal<{ speed: number; word: string }[]>([]);
  const cachedWordsRepartition = useSignal<Repartition | undefined>();
  const cachedPastRepartition = useSignal<Repartition | undefined>();
  const finishSignal = useSignal(false);

  // --- loaders ---
  const {
    value: { preset, words = [], wordsRepartition, pastRepartition },
  } = usePresetAndTrainingWords();
  const length = words.length;
  const isExerciseFinished = indexSignal.value === length;

  // --- actions ---
  const saveResultAction = useSaveData();
  const saveErrorAction = useSaveError();

  useVisibleTask$(() => {
    cachedWords.value = words;
    cachedWordsRepartition.value = wordsRepartition;
    cachedPastRepartition.value = pastRepartition;
  });

  const currentWord = useComputed$(
    () => cachedWords.value?.[indexSignal.value]?.word || "",
  );

  const hasError = !getIsMatching({
    target: currentWord.value,
    input: inputSignal.value,
  });

  useVisibleTask$(({ track }) => {
    track(() => lastErrorSignal.value);
    previousErrors.value = [...previousErrors.value, lastErrorSignal.value];
  });

  useVisibleTask$(({ track }) => {
    const index = track(() => indexSignal.value);
    const input = track(() => inputSignal.value);
    if (index === -1 && input === " ") {
      inputSignal.value = "";
      indexSignal.value = 0;
      startTime.value = Date.now();
    }
  });

  useVisibleTask$(({ track }) => {
    const index = track(() => indexSignal.value);
    if (index === -1) return;

    const input = track(() => inputSignal.value);
    const target = track(() => currentWord.value);
    if (!target) {
      finishSignal.value = true;
      return;
    }

    const isFinished = input === target + " ";
    console.log("isFinished", isFinished);
    if (isFinished) {
      const duration = Date.now() - startTime.value;
      saveResultAction.submit({
        duration,
        word: target,
      });

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
      {isExerciseFinished && (
        <Confetti client:load onFinish$={() => window.location.reload()} />
      )}

      <Title preset={preset} />

      <Analytics
        pastWordsRepartition={cachedPastRepartition.value}
        wordsRepartition={
          isExerciseFinished ? wordsRepartition : cachedWordsRepartition.value
        }
      />

      {cachedWords.value.length <= 1 ? (
        <SuccessMessage />
      ) : (
        <Text
          hasFinished={isExerciseFinished}
          hasStarted={indexSignal.value > -1}
          words={cachedWords.value}
          previousErrors={previousErrors.value}
          currentIndex={indexSignal.value}
          hasError={hasError}
          input={preset?.highlightLetter ? inputSignal.value : undefined}
        />
      )}

      <InputArea
        hasStarted={indexSignal.value > -1}
        inputSignal={inputSignal}
        ignoresSimpleBackspaces={preset?.forbidSimpleLetterBackspace ?? false}
      />
    </div>
  );
});
