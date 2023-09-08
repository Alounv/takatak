import { routeAction$ } from "@builder.io/qwik-city";

export const useSaveData = routeAction$(async ({ word, duration, userId }) => {
  const date = new Date();
  console.log("Saving data", word, duration, userId, date);
});

export const useSaveError = routeAction$(async ({ word, input, userId }) => {
  const date = new Date();
  console.log("Saving error", word, input, userId, date);
});
