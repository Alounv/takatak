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
  const lastErrorSignal = useSignal(-1);
  const { user } = userSignal.value || {};

  const currentWord = useComputed$(() => {
    return MockText.split(" ")[indexSignal.value];
  });

  useVisibleTask$(({ track }) => {
    const isFinished = track(
      () => inputSignal.value === currentWord.value + " ",
    );

    if (isFinished) {
      console.log("validation", currentWord.value);
      inputSignal.value = "";
      indexSignal.value++;
      return;
    }

    const hasError = track(() =>
      getHasError({ target: currentWord.value, input: inputSignal.value }),
    );

    if (!hasError) return;

    if (lastErrorSignal.value !== indexSignal.value) {
      console.log("ERROR", currentWord.value, inputSignal.value);
      lastErrorSignal.value = indexSignal.value;
    }
  });

  return (
    <div class="flex flex-col items-center gap-3">
      <div>{`Welcome ${user?.name}`}</div>
      <Text
        text={MockText}
        currentIndex={indexSignal.value}
        hasError={lastErrorSignal.value === indexSignal.value}
      />
      <input type="text" bind:value={inputSignal} />
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
  text,
  currentIndex,
  hasError,
}: {
  text: string;
  currentIndex: number;
  hasError: boolean;
}) => {
  return (
    <div>
      {text.split(" ").map((word, i) => {
        const cls = getClass(i, currentIndex, hasError);
        return (
          <span key={i} class={`${cls} text-md`}>
            {word}{" "}
          </span>
        );
      })}
    </div>
  );
};
