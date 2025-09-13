import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Profile } from "./database";

// Extended user type that includes profile data
export type User = SupabaseUser & {
  profile?: Profile;
};
