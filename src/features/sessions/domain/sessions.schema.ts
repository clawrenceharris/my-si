import z from "zod";

export const createSessionSchema = z.object({
  start_date: z.iso.date("Invalid date"),
  start_time: z.iso.time("Invalid time"),
  course_name: z.string().nonoptional(),
  topic: z.string().nonoptional(),
  description: z.string(),
  status: z
    .enum(["active", "completed", "canceled", "scheduled"])
    .default("scheduled")
    .nonoptional(),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
