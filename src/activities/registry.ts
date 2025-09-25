import { PlaybookDefinition } from "@/types/playbook";
import { SnowballActivity } from "./plugins/snowball";

export const registry: Record<string, PlaybookDefinition> = {
  snowball: SnowballActivity,
};
