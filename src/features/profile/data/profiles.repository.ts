import { supabase } from "@/lib/supabase/client";
import { BaseRepository } from "@/repositories/base.repository";
import { Tables } from "@/types";
import { Profiles } from "@/types/tables";

/**
 * Repository for profile data operations using Supabase
 * Contains only database access logic, no business rules
 */
export class ProfilesRepository extends BaseRepository<
  Profiles,
  Tables<"profiles">
> {
  constructor() {
    super(supabase, "user_profiles");
  }

  // You can add table-specific methods here
  async findByEmail(email: string): Promise<Profiles | null> {
    const { data: profile, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("email", email)
      .single();

    if (error || !profile) return null;
    return this.toDomain(profile as Profiles);
  }

  /**
   * Get current user's profile
   */
  async getCurrentProfile(): Promise<Profiles | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Profile doesn't exist yet
          return null;
        }
        throw error;
      }

      return this.toDomain(profile as Profiles);
    } catch (error) {
      throw error;
    }
  }
}

// Export singleton instance
export const profilesRepository = new ProfilesRepository();
