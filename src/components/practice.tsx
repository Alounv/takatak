import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { usePresetAndTrainingWords } from "~/routes/plugin@preset";
import type { Repartition } from "./analytics";
import { Analytics } from "./analytics";
import { Title } from "./practice-title";
import { InteractivePractice } from "./interactive-practice";
import { Chart } from "~/integrations/react/chart";

export const Practice = component$(() => {
  const cache = useSignal<
    | {
        words: { speed: number; word: string }[] | undefined;
        allWords: number[] | undefined;
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
      allWords: serverSignal.value.allWords,
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

      <WordChart
        words={cache.value?.allWords ?? []}
        limit={serverSignal.value.preset?.speed ?? 0}
      />
    </div>
  );
});

function WordChart({ words, limit }: { words: number[]; limit: number }) {
  if (!words.length) return null;
  const data = words.map((w) => {
    const v = w > limit ? w : 0;
    const nv = w <= limit ? w : 0;
    return { x: `${w}`, v, nv };
  });
  data.reverse();
  return <Chart data={data} />;
}
