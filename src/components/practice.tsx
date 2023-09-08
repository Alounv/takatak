import {
  component$,
  useComputed$,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { useAuthSession } from "~/routes/plugin@auth";
import { Text } from "./text";
import { InputArea } from "./input";
import { getIsMatching } from "~/utils";

export const Practice = component$(() => {
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
      if (currentWord.value !== " ") {
        // Save result
        const duration = Date.now() - startTime.value;
        console.log("validation", currentWord.value, duration);
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
        // Save error
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

      <InputArea index={indexSignal.value} inputSignal={inputSignal} />
    </div>
  );
});

const MockText = `a à acte aider air ajouter aller animal année appel après arrière aucun aussi autre avant avec avoir bas beaucoup besoin bien boîte bon cause ce certains ces changement chaque chaud chose comme comment construire côté dans de dehors déménagement deux différer dire dit donner droit eau écrire elle encore ensemble épeler essayer est allé est venu est et étaient était été être eu fabriqué faible faire fait faut fin forme garçon genre grand haut homme hommes ici il ils image interroger je jouer jour juste la là le les leur lieu ligne lire long lui lumière ma main maintenant mais maison manière même mère mettre moi monde montrer mot ne nom nombre notre nous nouveau obtenir ou où par partie partir penser père personnes petit peu peut phrase plus point port pour pourquoi pourrait première prendre près puis quand que qui regarder savoir seulement si signifier soi son sont sous suivre sur tel temps terre tour tous tout travail très trois trop trouver un utiliser venir vers vieux vivre voir volonté votre voudrais vouloir vous`;
