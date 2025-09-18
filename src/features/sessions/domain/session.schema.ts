import z from "zod";

export const createSessionSchema = z.object({
  lessonId: z.uuid(),
  startDate: z.iso.date("Invalid date"),
  startTime: z.iso.time("Invalid time"),
  topic: z.string().optional(),
  description: z
    .string()
    .min(10, "Description should be at least 10 characters")
    .optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
