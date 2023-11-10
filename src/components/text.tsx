const CLS = {
  past: "text-gray-200 dark:text-gray-600",
  current: "text-black dark:text-white",
  error: "text-red-500 dark:text-red-500",
  future: "text-black dark:text-white opacity-50",
};

const getWordClass = (
  index: number,
  currentIndex: number,
  hadError: boolean,
  hasError: boolean,
) => {
  if (index < currentIndex) return hadError ? CLS.error : CLS.past;
  if (index === currentIndex) return hasError ? CLS.error : CLS.current;
  return CLS.future;
};

const getLetterClass = (
  index: number,
  currentIndex: number,
  hasError: boolean,
) => {
  if (index < currentIndex) return CLS.past;
  if (index === currentIndex) return hasError ? CLS.error : CLS.current;
  return CLS.current;
};

const Word = ({
  index,
  currentIndex,
  hadError,
  hasError,
  word,
  input,
}: {
  index: number;
  currentIndex: number;
  hadError: boolean;
  hasError: boolean;
  word: string;
  key: number;
  input?: string;
}) => {
  if (input && index === currentIndex) {
    return (
      <span class="flex">
        {word.split("").map((c, i) => {
          const cls = getLetterClass(i, input.length, hasError);
          return (
            <span key={i} class={`${cls}`}>
              {c}
            </span>
          );
        })}
      </span>
    );
  }

  const cls = getWordClass(index, currentIndex, hadError, hasError);
  return <span class={`${cls}`}>{word} </span>;
};

export const Text = ({
  words,
  currentIndex,
  hasError,
  previousErrors,
  input,
}: {
  words: string[];
  currentIndex: number;
  hasError: boolean;
  previousErrors: number[];
  input?: string;
}) => {
  return (
    <div class="flex  flex-wrap items-center gap-1.5 text-lg tracking-wider">
      {words.map((word, i) =>
        word === " " ? null : (
          <Word
            key={i}
            index={i}
            currentIndex={currentIndex}
            hadError={previousErrors.includes(i)}
            hasError={hasError}
            word={word}
            input={input}
          />
        ),
      )}
    </div>
  );
};
