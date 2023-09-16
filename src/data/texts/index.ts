import { english10k } from "./english10k";
import { english1k } from "./english1k";
import { english5k } from "./english5k";
import { french10k } from "./french10k";
import { french1_5k } from "./french1k";

export enum SharedTextNames {
  French1_5k = "french 1.5 k",
  French10k = "french 10 k",
  English1k = "english 1 k",
  English5k = "english 5 k",
  English10k = "english 10 k",
}

export const getSharedText = (name: string) => {
  switch (name) {
    case SharedTextNames.French1_5k:
      return french1_5k;
    case SharedTextNames.French10k:
      return french10k;
    case SharedTextNames.English1k:
      return english1k;
    case SharedTextNames.English5k:
      return english5k;
    case SharedTextNames.English10k:
      return english10k;
    default:
      return "";
  }
};
