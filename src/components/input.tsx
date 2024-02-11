import type { Signal } from "@builder.io/qwik";
import { Input } from "~/design/input";

export const InputArea = ({ inputSignal }: { inputSignal: Signal<string> }) => {
  return (
    <div class="flex gap-2">
      <Input id="typing-area" type="text" signal={inputSignal} autoFocus />
    </div>
  );
};
