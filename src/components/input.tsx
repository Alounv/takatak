import type { Signal } from "@builder.io/qwik";
import { AutoFocusedInput } from "~/design/input";

export const InputArea = ({
  hasStarted,
  inputSignal,
  ignoresSimpleBackspaces,
}: {
  hasStarted: boolean;
  inputSignal: Signal<string>;
  ignoresSimpleBackspaces: boolean;
}) => {
  return (
    <div class="flex gap-2">
      <AutoFocusedInput
        id="typing-area"
        type="text"
        placeholder={hasStarted ? "" : "Press space to start"}
        signal={inputSignal}
        ignoresSimpleBackspaces={ignoresSimpleBackspaces}
      />
    </div>
  );
};
