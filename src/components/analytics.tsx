import { component$ } from "@builder.io/qwik";

export const Analytics = component$(
  ({ words }: { words: { word: string; speed: number }[] }) => {
    return (
      <div>
        {words.map(({ word, speed }) => {
          return (
            <div key={word} class="flex gap-4">
              <div>{Math.round(speed)} wpm</div>
              <div>{word}</div>
            </div>
          );
        })}
      </div>
    );
  },
);
