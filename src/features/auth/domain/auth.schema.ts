import z from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .max(
      20,
      "That's a pretty long name! Could you try to keep it under 20 characters."
    ),
  lastName: z
    .string()
    .max(
      20,
      "That's a pretty long name! Could you try to keep it under 20 characters."
    ),

  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
