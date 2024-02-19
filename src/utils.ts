const LONG_CHARS = ["^", "¨"];

export const getIsMatching = ({
  target,
  input,
}: {
  target: string;
  input: string;
}) => {
  if (!target) return false;
  const trimmedInput = input.trim();
  return (
    target.startsWith(trimmedInput) ||
    LONG_CHARS.includes(trimmedInput.slice(-1))
  );
};

export const getWordsFromText = (text: string = "") => {
  const textWithoutSpaces = text.replace(/[\n\r\s]+/g, " ");
  return [...new Set(textWithoutSpaces.split(" "))];
};
