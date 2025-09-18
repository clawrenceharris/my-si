import { z } from "zod";

export const chatMessageSchema = z.object({
  mode: z.string().trim(),
  topic: z.string("Please enter a topic"),
});

export type ChatFormData = z.infer<typeof chatMessageSchema>;
