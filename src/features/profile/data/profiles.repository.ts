import { BaseRepository } from "@/repositories/base.repository";
import { Profiles } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";
/**
 * Repository for profile data operations using Supabase
 * Contains only database access logic, no business rules
 */
export class ProfilesRepository extends BaseRepository<Profiles, Profiles> {
  constructor(client: SupabaseClient) {
    super(client, "profiles");
  }

  async getProfile(userId: string): Promise<Profiles | null> {
    const { data, error } = await this.client
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) return null;
    return data;
  }
}
