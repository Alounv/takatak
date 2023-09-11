import { Preset } from "~/server/db/schema";

export const Title = ({ preset }: { preset: Preset | undefined }) => {
  return (
    <div class="flex items-center gap-4">
      <div class="text-lg font-medium">Practice</div>
      <div class="text-gray-500">
        <span>{preset?.name || "None"}</span>
        <span class="mx-2">|</span>
        <span>{preset?.speed || 0} WPM</span>
        <span class="mx-2">|</span>
        <span>{preset?.repetitions || 0} Repetitions</span>
      </div>
    </div>
  );
};
