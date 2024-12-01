import type { QRL } from "@builder.io/qwik";
import {
  component$,
  useComputed$,
  useSignal,
  useVisibleTask$,
  $,
} from "@builder.io/qwik";
import { Text } from "./text";
import { InputArea } from "./input";
import { getIsMatching } from "~/utils";
import { useSaveData, useSaveError } from "~/routes/plugin@save";
import { Confetti } from "~/integrations/react/confetti";
import { SuccessMessage } from "./placeholder";
import type { Preset } from "~/server/db/schema";

export const InteractivePractice = component$(
  ({
    preset,
    words,
    reset: resetData,
  }: {
    preset: Preset;
    words: { speed: number; word: string }[];
    reset: QRL<() => void>;
  }) => {
    // --- states ---
    const indexSignal = useSignal(-1);
    const inputSignal = useSignal("");
    const startTime = useSignal(0);
    const previousErrors = useSignal<number[]>([]);
    const finishSignal = useSignal(false);
    const isExerciseFinished = indexSignal.value === words?.length;

    // --- actions ---
    const saveResultAction = useSaveData();
    const saveErrorAction = useSaveError();

    // --- Current word being typed
    const currentWord = useComputed$(
      () => words?.[indexSignal.value]?.word || "",
    );

    // --- Is there an error in the current word
    const hasError = useComputed$(
      () =>
        !getIsMatching({
          target: currentWord.value,
          input: inputSignal.value,
        }),
    );

    /*
     * Reset the state when the resetSignal is triggered
     */
    const onFinish = $(() => {
      indexSignal.value = -1;
      inputSignal.value = "";
      previousErrors.value = [];
      finishSignal.value = false;
      resetData();
    });

    /*
     * If this is the first space typed, initialize
     */
    useVisibleTask$(({ track }) => {
      const index = track(() => indexSignal.value);
      const input = track(() => inputSignal.value);
      if (index === -1 && input === " ") {
        inputSignal.value = "";
        indexSignal.value = 0;
      }
    });

    /*
     * When the input is equal to the current word, save the result and update the state
     * If there is an error, save the error and update the state
     */
    useVisibleTask$(({ track }) => {
      const index = track(() => indexSignal.value);
      if (index === -1) return;

      const input = track(() => inputSignal.value);
      const target = track(() => currentWord.value);
      if (!target) {
        finishSignal.value = true;
        return;
      }

      //  We start the timer when the first letter is typed
      const now = Date.now();
      if (input.length > 0 && !startTime.value) {
        startTime.value = now;
        return;
      }

      // When the space is hit after correctly typing the word
      if (input === target + " ") {
        let duration = Date.now() - startTime.value;

        // If there is an error, double the saved duration (penalty on top of the time to write it corectly)
        if (hasError.value) {
          duration= duration*2
        }

        startTime.value = 0;
        // Save the result
        saveResultAction.submit({ duration, word: target });

        // Update speed of the word for local display
        const speed = Math.round(
          ((target.length / (duration / 1000)) * 60) / 5,
        );
        words[index].speed = speed;

        // Move to next word
        inputSignal.value = "";
        indexSignal.value++;

        return;
      }

      /*
       * If there is an unregistered error, save the error and update the state
       */
      const err = track(() => hasError.value);
      if (
        err &&
        previousErrors.value[0] !== indexSignal.value &&
        currentWord.value !== " "
      ) {
        saveErrorAction.submit({
          word: currentWord.value,
          input: inputSignal.value,
        });
        previousErrors.value = [indexSignal.value, ...previousErrors.value];
      }
    });

    useVisibleTask$(({ track }) => {
      const index = track(() => indexSignal.value);
      const isExerciseFinished = index === words?.length;

      if (isExerciseFinished) {
        const interval = setTimeout(() => {
          onFinish();
        }, 4000);

        return () => clearTimeout(interval);
      }
    });

    return (
      <>
        {isExerciseFinished && <Confetti client: load onFinish$={() => { }} />}

        {words.length <= 1 ? (
          <SuccessMessage />
        ) : (
          <Text
            hasFinished={isExerciseFinished}
            hasStarted={indexSignal.value > -1}
            words={words || []}
            previousErrors={previousErrors.value}
            currentIndex={indexSignal.value}
            hasError={hasError.value}
            target={preset.speed}
            input={preset.highlightLetter ? inputSignal.value : undefined}
          />
        )}

        <InputArea
          hasStarted={indexSignal.value > -1}
          inputSignal={inputSignal}
          ignoresSimpleBackspaces={preset.forbidSimpleLetterBackspace ?? false}
        />
      </>
    );
  },
);
