import type { Signal } from "@builder.io/qwik";
import { Input } from "~/design/input";

export const InputArea = ({
  index,
  inputSignal,
}: {
  index: number;
  inputSignal: Signal<string>;
}) => {
  return (
    <div class="flex gap-2">
      <Input id="typing-area" type="text" signal={inputSignal} autoFocus />

      {index === 0 && (
        <div class="text-red-500 py-1 px-4 rounded flex items-center font-bold">
          {`press space twice to start`}
        </div>
      )}
    </div>
  );
};
