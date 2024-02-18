import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import { Button } from "~/design/button";
import { Input } from "~/design/input";
import { Slider } from "~/design/slider";
import { TextArea } from "~/design/textarea";
import { Toggle } from "~/design/toggle";
import {
  useCreateEmptyPreset,
  useDeletePreset,
  useListPresets,
  useSelectPreset,
  useUpdatePreset,
} from "~/routes/plugin@preset";
import { useGetCurrentUser } from "~/routes/plugin@user";
import type { Preset } from "~/server/db/schema";
import { getWordsFromText } from "~/utils";

export const Settings = component$(() => {
  const user = useGetCurrentUser();
  const presets = useListPresets();
  const selectedPresetId = user.value?.selectedPresetId;
  const presetsList = presets.value.data || [];
  const currentPreset = presetsList.find((p) => p.id === selectedPresetId);

  return (
    <div class="flex flex-col gap-10">
      <div class="text-lg font-medium">Settings</div>

      <div>
        <div class="text-md font-medium mb-3">List of presets</div>
        <PresetList
          selectedPresetId={selectedPresetId}
          presetsList={presetsList}
        />
        <CreatePreset />
      </div>

      {currentPreset && <PresetEdition preset={currentPreset} />}
    </div>
  );
});

const PresetList = component$(
  ({
    selectedPresetId,
    presetsList,
  }: {
    selectedPresetId: string | undefined;
    presetsList: Preset[];
  }) => {
    const deleteAction = useDeletePreset();
    const selectAction = useSelectPreset();

    return (
      <ul class="flex flex-col gap-3 w-full">
        {presetsList.map((p) => {
          const isSelected = p.id === selectedPresetId;
          return (
            <li key={p.id} class="flex gap-3 items-center">
              -
              <label
                for={p.id}
                class={`px-2 py-1 text-sm font-medium text-center text-white rounded-lg ${
                  isSelected
                    ? "bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
                    : "bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-800 dark:hover:bg-gray-900 dark:focus:ring-gray-900"
                }`}
              >
                {p.name}
              </label>
              <input
                type="radio"
                class="hidden"
                name="presetId"
                id={p.id}
                value={p.id}
                onClick$={() => {
                  selectAction.submit({ id: p.id });
                }}
              />
              {!isSelected && !p.isShared && (
                <Button
                  small
                  disabled={isSelected || !!p.isShared}
                  isSecondary
                  onClick$={() => {
                    if (
                      confirm("Are you sure you want to delete this preset?")
                    ) {
                      deleteAction.submit({ id: p.id });
                    }
                  }}
                >
                  delete
                </Button>
              )}
            </li>
          );
        })}
      </ul>
    );
  },
);

export const CreatePreset = component$(() => {
  const createAction = useCreateEmptyPreset();
  return (
    <Form action={createAction} class="flex items-end gap-3 mt-3">
      <Input
        innerCls="mb-0"
        type="text"
        name="name"
        required
        id="name"
        placeholder="New preset name"
      />
      <Button type="submit">create</Button>
    </Form>
  );
});

export const PresetEdition = component$(({ preset }: { preset: Preset }) => {
  const updateAction = useUpdatePreset();
  const totalCorpusSize = getWordsFromText(preset.text || "").length;

  return (
    <div>
      <div class="text-md font-medium mb-3">Edition</div>
      <Form action={updateAction} class="flex flex-col gap-2 w-full">
        <input type="hidden" name="id" value={preset.id} />
        <div class="flex gap-4">
          <div class="flex flex-col gap-1 flex-1">
            <Input
              id="name"
              type="text"
              name="name"
              value={preset.name}
              label="Name"
              description="Name of the preset"
              disabled={!!preset.isShared}
            />
            <Input
              label="Session length"
              description="Length of the session in words"
              id="sessionLength"
              type="number"
              name="sessionLength"
              value={preset.sessionLength}
            />
            <Input
              label="Validation speed (WPM)"
              description="For word to be considered valid, it must be typed at this speed for the last R repetitions"
              id="speed"
              type="number"
              name="speed"
              value={preset.speed}
            />
            <Slider
              id="repetitions"
              label="R Repetitions"
              description="Number of repetitions used to calculate the speed"
              name="repetitions"
              value={preset.repetitions}
              max={3}
            />
            <Toggle
              cls="mt-4"
              label="Highlight letter"
              name="highlightLetter"
              description="Highlight the letter instead of the word"
              checked={preset.highlightLetter || false}
            />
            <Toggle
              cls="mt-4"
              label="Forbid simple letter backspace"
              name="forbidSimpleLetterBackspace"
              description="Forbid the use of the backspace to correct a single letter, forcing the user to delete the whole word with ALT + Backspace."
              checked={preset.forbidSimpleLetterBackspace || false}
            />
            <Button type="submit" cls="mt-4">
              save
            </Button>
          </div>

          <div class="flex flex-col gap-1 flex-1">
            <TextArea
              id="text"
              cls="flex-1"
              name="text"
              value={preset.text}
              label="Words to learn"
              description="List of words to practice, separated by a space or a new line. Order may be important if you use the corpus size."
              rows={16}
              disabled={!!preset.isShared}
            />
            <Input
              label="Special letters"
              description="Letters counted as two letters, artificially increasing the WPM on the words containing them."
              id="doubleLetters"
              type="text"
              name="doubleLetters"
              value={preset.doubleLetters || ""}
            />
            <Slider
              id="corpusSize"
              name="corpusSize"
              description="To practice on a subset of the words (the first ones)"
              value={preset.corpusSize || totalCorpusSize}
              max={totalCorpusSize}
              label="Corpus size"
            />
          </div>
        </div>
      </Form>
    </div>
  );
});
