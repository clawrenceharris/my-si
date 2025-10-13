import { PlaybookDefinition } from "@/types/playbook";
import { SnowballActivity } from "./plugins/snowball";
import { PassTheProblemActivity } from "./plugins/pass-the-problem";

export const registry: Record<string, PlaybookDefinition> = {
  snowball: SnowballActivity,
  "pass-the-problem": PassTheProblemActivity,
};
