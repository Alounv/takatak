const LONG_CHARS = ["^", "¨"];

export const getIsMatching = ({
  target,
  input,
}: {
  target: string;
  input: string;
}) => {
  if (!target) return false;
  return target.startsWith(input) || LONG_CHARS.includes(input.slice(-1));
};

export const getWordsFromText = (text: string = "") => {
  const textWithoutSpaces = text.replace(/[\n\r\s]+/g, " ");
  return [...new Set(textWithoutSpaces.split(" "))];
};
