import type { Signal } from "@builder.io/qwik";
import { Input } from "~/design/input";

export const InputArea = ({
  index,
  inputSignal,
}: {
  index: number;
  inputSignal: Signal<string>;
}) => {
  const hasStarted = index !== 0;
  return (
    <div class="flex gap-2">
      <Input
        id="typing-area"
        type="text"
        signal={inputSignal}
        autoFocus
        innerCls={hasStarted ? "" : "bg-red-200"}
      />

      {!hasStarted && (
        <div class="text-red-500 py-1 px-4 rounded flex items-center font-medium">
          {`press space twice to start`}
        </div>
      )}
    </div>
  );
};
