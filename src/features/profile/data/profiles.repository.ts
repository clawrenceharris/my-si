import { BaseRepository } from "@/repositories/base.repository";
import { Profiles } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for profile data operations using Supabase
 * Contains only database access logic, no business rules
 */
export class ProfilesRepository extends BaseRepository<Profiles> {
  constructor(client: SupabaseClient) {
    super(client, "profiles");
  }
}
