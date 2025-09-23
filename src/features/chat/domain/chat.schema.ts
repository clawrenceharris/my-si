import { z } from "zod";

export const chatMessageSchema = z.object({
  mode: z.string().trim(),
  topic: z.string("Please enter a topic"),
  course_name: z.string("Please enter the course name"),
});

export type ChatFormData = z.infer<typeof chatMessageSchema>;
