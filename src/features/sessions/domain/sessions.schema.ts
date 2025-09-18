import z from "zod";

export const createSessionSchema = z.object({
  start_date: z.iso.date("Invalid date"),
  start_time: z.iso.time("Invalid time"),
  topic: z.string().optional(),
  virtual: z.boolean().optional(),
  description: z.string().optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
