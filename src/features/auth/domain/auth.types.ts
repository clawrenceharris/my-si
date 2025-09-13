import { User } from "@supabase/supabase-js";
import { loginSchema, signupSchema } from "./auth.schema";
import z from "zod";

export type { User };

export type LoginFormInput = z.infer<typeof loginSchema>;
export type SignUpFormInput = z.infer<typeof signupSchema>;

// Onboarding data interface
export interface OnboardingData {
  displayName: string;
  favoriteGenres: string[];
  bio?: string;
  email: string;
  quote?: string;
  userId: string;
  username: string;
  avatarUrl?: string;
}

// Authentication state interface
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
