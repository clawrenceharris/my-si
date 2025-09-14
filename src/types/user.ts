import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Profiles } from "./tables";

export type UserRole = "si_leader" | "student" | "coordinator";

// Extended user type that includes profile data
export type User = SupabaseUser & {
  profile: Profiles;
};
