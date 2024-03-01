import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { usePresetAndTrainingWords } from "~/routes/plugin@preset";
import type { Repartition } from "./analytics";
import { Analytics } from "./analytics";
import { Title } from "./practice-title";
import { InteractivePractice } from "./interactive-practice";

export const Practice = component$(() => {
  const cache = useSignal<
    | {
        words: { speed: number; word: string }[] | undefined;
        wordsRepartition: Repartition | undefined;
        pastRepartition: Repartition | undefined;
      }
    | undefined
  >();

  const serverSignal = usePresetAndTrainingWords();

  const reset = $(() => {
    cache.value = {
      words: serverSignal.value.words,
      wordsRepartition: serverSignal.value.wordsRepartition,
      pastRepartition: serverSignal.value.pastRepartition,
    };
  });

  useVisibleTask$(() => {
    reset();
  });

  return (
    <div class="flex flex-col gap-10">
      <Title preset={serverSignal.value.preset} />

      <Analytics
        pastWordsRepartition={cache.value?.pastRepartition}
        wordsRepartition={cache.value?.wordsRepartition}
      />

      {serverSignal.value.preset && cache.value?.words && (
        <InteractivePractice
          preset={serverSignal.value.preset}
          words={cache.value.words}
          reset={reset}
        />
      )}
    </div>
  );
});
