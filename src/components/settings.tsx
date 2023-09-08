import { component$ } from "@builder.io/qwik";
import { Form } from "@builder.io/qwik-city";
import {
  useCreateEmptyPreset,
  useListPresets,
  useSelectPreset,
  useUpdatePreset,
} from "~/routes/plugin@preset";
import { useGetCurrentUser } from "~/routes/plugin@user";
import type { Preset } from "~/server/db/schema";

export const Settings = component$(() => {
  const user = useGetCurrentUser();
  const presets = useListPresets();
  const createAction = useCreateEmptyPreset();
  const selectAction = useSelectPreset();
  const selectedPresetId = user.value?.selectedPresetId;
  const presetsList = presets.value.data || [];
  const currentPreset = presetsList.find((p) => p.id === selectedPresetId);

  return (
    <div class="flex flex-col items-center gap-5">
      <div class="text-lg font-medium">Settings</div>
      <Form action={createAction} class="flex gap-3">
        <button
          type="submit"
          class="rounded-lg text-sm font-semibold py-2  px-4 bg-sky-600 text-white hover:bg-sky-700"
        >
          create a preset
        </button>
        <input
          type="text"
          name="name"
          required
          id="name"
          placeholder="preset name"
        />
      </Form>
      List of presets:
      <div class="flex flex-col gap-4 w-full">
        {presetsList.map((p) => {
          const isSelected = p.id === selectedPresetId;
          return (
            <div key={p.id}>
              {isSelected && <span>[ </span>}
              <label for={p.id}>{p.name}</label>
              {isSelected && <span> ]</span>}
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
            </div>
          );
        })}
      </div>
      Current preset:
      {currentPreset && <PresetEdition preset={currentPreset} />}
    </div>
  );
});

export const PresetEdition = component$(({ preset }: { preset: Preset }) => {
  const action = useUpdatePreset();

  return (
    <Form action={action} class="flex flex-col gap-1 w-full">
      <input type="hidden" name="id" value={preset.id} />
      <div class="flex gap-1">
        <div class="flex flex-col gap-1">
          <input type="text" name="name" value={preset.name} />
          <input
            type="number"
            name="sessionLenght"
            value={preset.sessionLength}
          />
          <input type="number" name="speed" value={preset.speed} />
          <input type="number" name="repetitions" value={preset.repetitions} />
        </div>

        <textarea class="flex-1" name="text" value={preset.text} />
      </div>

      <button
        type="submit"
        class="rounded-lg text-sm font-semibold py-2  px-4 bg-sky-600 text-white hover:bg-sky-700 self-end"
      >
        update
      </button>
    </Form>
  );
});
