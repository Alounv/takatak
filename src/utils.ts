export const getIsMatching = ({
  target,
  input,
}: {
  target: string;
  input: string;
}) => target.startsWith(input) || ["^", "¨"].includes(input.slice(-1));
