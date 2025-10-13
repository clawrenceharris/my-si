import z from "zod";
import { loginSchema, signUpSchema } from "./";

export type SignUpFormInput = z.infer<typeof signUpSchema>;
export type LoginFormInput = z.infer<typeof loginSchema>;
