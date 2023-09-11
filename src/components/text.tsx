const CLS = {
  past: "text-gray-200",
  current: "text-sky-600",
  error: "text-red-500",
  future: "text-black",
};

const getClass = (index: number, currentIndex: number, hasError: boolean) => {
  if (index < currentIndex) return CLS.past;
  if (index === currentIndex) return hasError ? CLS.error : CLS.current;
  return CLS.future;
};

const Word = ({
  index,
  currentIndex,
  hasError,
  word,
}: {
  index: number;
  currentIndex: number;
  hasError: boolean;
  word: string;
  key: number;
}) => {
  const cls = getClass(index, currentIndex, hasError);
  return <span class={`${cls} text-md`}>{word} </span>;
};

export const Text = ({
  words,
  currentIndex,
  hasError,
}: {
  words: string[];
  currentIndex: number;
  hasError: boolean;
}) => {
  return (
    <div class="flex  flex-wrap items-center gap-2 text-lg tracking-wide font-medium">
      {words.map((word, i) =>
        word === " " ? null : (
          <Word
            key={i}
            index={i}
            currentIndex={currentIndex}
            hasError={hasError}
            word={word}
          />
        ),
      )}
    </div>
  );
};
