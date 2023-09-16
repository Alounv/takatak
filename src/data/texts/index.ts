import { french10k } from "./french10k";
import { french1_5k } from "./french1k";

export enum SharedTextNames {
  French1_5k = "french 1.5 k",
  French10k = "french 10 k",
}

export const getSharedText = (name: string) => {
  switch (name) {
    case SharedTextNames.French1_5k:
      return french1_5k;
    case SharedTextNames.French10k:
      return french10k;
    default:
      return "";
  }
};
