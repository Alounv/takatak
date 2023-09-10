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
