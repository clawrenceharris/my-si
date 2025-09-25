import { BaseRepository } from "@/repositories/base.repository";
import { Sessions } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for sessions data operations using Supabase
 * Contains only database access logic, no business rules
 */
export class SessionsRepository extends BaseRepository<Sessions> {
  constructor(client: SupabaseClient) {
    super(client, "sessions");
  }
}
