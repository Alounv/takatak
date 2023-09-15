export const getIsMatching = ({
  target,
  input,
}: {
  target: string;
  input: string;
}) => {
  if (!target) return false;
  return target.startsWith(input) || ["^", "¨"].includes(input.slice(-1));
};

export const getWordsFromText = (text: string = "") => {
  return [...new Set(text.split(/[ :\n:\r]/))];
};
