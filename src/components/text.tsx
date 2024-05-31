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
  speed,
  input,
  showSpeed,
  target,
}: {
  index: number;
  currentIndex: number;
  hadError: boolean;
  hasError: boolean;
  word: string;
  speed: number;
  key: number;
  input?: string;
  showSpeed?: boolean;
  target: number;
}) => {
  if (input && index === currentIndex) {
    return (
      <span class="flex" title={`${speed} wpm`}>
        {word.split("").map((c, i) => {
          return (
            <span key={i} class={getLetterClass(i, input.length, hasError)}>
              {c}
            </span>
          );
        })}
      </span>
    );
  }

  const cls = getWordClass(index, currentIndex, hadError, hasError);
  return (
    <>
      <span class={cls} title={`${speed} wpm`}>
        {word}{" "}
      </span>
      {showSpeed ? (
        <span
          class={`text-sm ${
            speed >= target ? "text-sky-500" : "text-pink-500"
          }`}
        >
          {speed}{" "}
        </span>
      ) : null}
    </>
  );
};

export const Text = ({
  words,
  currentIndex,
  hasError,
  previousErrors,
  hasStarted,
  hasFinished,
  input,
  target,
}: {
  words: { speed: number; word: string }[];
  currentIndex: number;
  hasError: boolean;
  previousErrors: number[];
  input?: string;
  hasStarted: boolean;
  hasFinished: boolean;
  target: number;
}) => {
  return (
    <div class="flex  flex-wrap items-center gap-1.5 text-lg tracking-wider">
      {!hasStarted ? <Start words={words} /> : null}
      {words.map((word, i) =>
        word.word === " " ? null : (
          <Word
            key={i}
            index={i}
            currentIndex={currentIndex}
            hadError={previousErrors.includes(i)}
            hasError={hasError}
            word={word.word}
            speed={word.speed}
            target={target}
            input={input}
            showSpeed={hasFinished}
          />
        ),
      )}
    </div>
  );
};

function Start({ words }: { words: { speed: number; word: string }[] }) {
  const speeds = words.map((w) => w.speed);
  const max = Math.max(...speeds);
  const min = Math.min(...speeds);
  return (
    <>
      <div class="text-gray-500 text-sm">{`(${max}-${min})`}</div>
      <div>{`[space]`}</div>
    </>
  );
}
