import { supabase } from "@/lib/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/types";
import { UserProfile } from "../domain/profiles.types";

/**
 * Repository for profile data operations using Supabase
 * Contains only database access logic, no business rules
 */
export class ProfilesRepository {
  /**
   * Create a new user profile
   */
  async create(data: TablesInsert<"profiles">): Promise<UserProfile> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .insert(data)
        .select()
        .maybeSingle();

      if (error) {
        throw error;
      }

      return this.mapDatabaseToProfile(profile);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get profile by user ID
   */
  async getByUserId(userId: string): Promise<UserProfile> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        throw error;
      }

      return this.mapDatabaseToProfile(profile);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST116") {
          // Profile doesn't exist yet
          return null;
        }
        throw error;
      }

      return this.mapDatabaseToProfile(profile);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update profile by user ID
   */
  async updateByUserId(
    userId: string,
    updatedData: TablesUpdate<"profiles">
  ): Promise<UserProfile> {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this.mapDatabaseToProfile(profile);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update current user's profile
   */
  async updateCurrentProfile(
    updatedData: TablesUpdate<"profiles">
  ): Promise<UserProfile> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .update(updatedData)
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this.mapDatabaseToProfile(profile);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if profile exists for user
   */
  async existsByUserId(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST116") {
          return false;
        }
        throw error;
      }

      return !!data;
    } catch {
      return false;
    }
  }

  /**
   * Delete profile by user ID
   */
  async deleteByUserId(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Map database row to UserProfile type
   */
  private mapDatabaseToProfile(dbProfile: Tables<"profiles">): UserProfile {
    return {
      id: dbProfile.id,
      full_name: dbProfile.full_name,
      avatar_url: dbProfile.avatar_url || undefined,
      role: dbProfile.role || undefined,
      onboarding_complete: dbProfile.onboarding_completed || false,
      courses_instructed: dbProfile.courses || [],
      created_at: dbProfile.created_at,
    };
  }
}

// Export singleton instance
export const profilesRepository = new ProfilesRepository();
