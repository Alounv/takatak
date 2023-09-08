import {
  component$,
  useComputed$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useAuthSession } from "~/routes/plugin@auth";

const getHasError = ({ target, input }: { target: string; input: string }) => {
  const len = input.length;
  return target.slice(0, len) !== input.slice(0, len);
};

export const Welcome = component$(() => {
  const userSignal = useAuthSession();
  const indexSignal = useSignal(0);
  const inputSignal = useSignal("");
  const startTime = useSignal(0);
  const lastErrorSignal = useSignal(-1);
  const { user } = userSignal.value || {};
  const words = [" ", ...MockText.split(" ")];

  const currentWord = useComputed$(() => {
    return words[indexSignal.value];
  });

  useVisibleTask$(({ track }) => {
    const isFinished = track(
      () => inputSignal.value === currentWord.value + " ",
    );

    if (isFinished) {
      const duration = Date.now() - startTime.value;
      if (currentWord.value !== " ") {
        console.log("validation", currentWord.value, duration);
      }
      inputSignal.value = "";
      indexSignal.value++;
      startTime.value = Date.now();
      return;
    }

    const hasError = track(() =>
      getHasError({ target: currentWord.value, input: inputSignal.value }),
    );

    if (!hasError) return;

    if (lastErrorSignal.value !== indexSignal.value) {
      if (currentWord.value !== " ") {
        console.log("ERROR", currentWord.value, inputSignal.value);
        lastErrorSignal.value = indexSignal.value;
      }
    }
  });

  return (
    <div class="flex flex-col items-center gap-3">
      <div>{`Welcome ${user?.name}`}</div>
      <Text
        words={words}
        currentIndex={indexSignal.value}
        hasError={lastErrorSignal.value === indexSignal.value}
      />

      <div class="flex gap-2">
        {indexSignal.value === 0 && (
          <div class="bg-sky-500 text-white py-1 px-4 rounded flex items-center">
            {`press space twice to start`}
          </div>
        )}
        <input type="text" bind:value={inputSignal} />
      </div>
    </div>
  );
});

const MockText = `a à acte aider air ajouter aller animal année appel après arrière aucun aussi autre avant avec avoir bas beaucoup besoin bien boîte bon cause ce certains ces changement chaque chaud chose comme comment construire côté dans de dehors déménagement deux différer dire dit donner droit eau écrire elle encore ensemble épeler essayer est allé est venu est et étaient était été être eu fabriqué faible faire fait faut fin forme garçon genre grand haut homme hommes ici il ils image interroger je jouer jour juste la là le les leur lieu ligne lire long lui lumière ma main maintenant mais maison manière même mère mettre moi monde montrer mot ne nom nombre notre nous nouveau obtenir ou où par partie partir penser père personnes petit peu peut phrase plus point port pour pourquoi pourrait première prendre près puis quand que qui regarder savoir seulement si signifier soi son sont sous suivre sur tel temps terre tour tous tout travail très trois trop trouver un utiliser venir vers vieux vivre voir volonté votre voudrais vouloir vous`;

const CLS = {
  past: "text-gray-200",
  current: "text-blue-600",
  error: "text-red-500",
  future: "text-gray-500",
};

const getClass = (index: number, currentIndex: number, hasError: boolean) => {
  if (index < currentIndex) return CLS.past;
  if (index === currentIndex) {
    if (hasError) return CLS.error;
    return CLS.current;
  }
  return CLS.future;
};

const Text = ({
  words,
  currentIndex,
  hasError,
}: {
  words: string[];
  currentIndex: number;
  hasError: boolean;
}) => {
  return (
    <div class="flex flex-col items-center gap-1">
      <div>
        {words.map((word, i) => {
          const cls = getClass(i, currentIndex, hasError);
          return (
            <span key={i} class={`${cls} text-md`}>
              {word}{" "}
            </span>
          );
        })}
      </div>
    </div>
  );
};
