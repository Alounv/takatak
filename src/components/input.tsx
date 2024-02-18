import type { Signal } from "@builder.io/qwik";
import { AutoFocusedInput } from "~/design/input";

export const InputArea = ({
  inputSignal,
  ignoresSimpleBackspaces,
}: {
  inputSignal: Signal<string>;
  ignoresSimpleBackspaces: boolean;
}) => {
  return (
    <div class="flex gap-2">
      <AutoFocusedInput
        id="typing-area"
        type="text"
        signal={inputSignal}
        ignoresSimpleBackspaces={ignoresSimpleBackspaces}
      />
    </div>
  );
};
