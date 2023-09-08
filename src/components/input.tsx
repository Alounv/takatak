import { Signal } from "@builder.io/qwik";

export const InputArea = ({
  index,
  inputSignal,
}: {
  index: number;
  inputSignal: Signal<string>;
}) => {
  return (
    <div class="flex gap-2">
      {index === 0 && (
        <div class="bg-sky-500 text-white py-1 px-4 rounded flex items-center">
          {`press space twice to start`}
        </div>
      )}
      <input type="text" bind:value={inputSignal} />
    </div>
  );
};
