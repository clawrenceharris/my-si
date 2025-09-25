import { BaseRepository } from "@/repositories/base.repository";
import { Strategies } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for strategies data operations using Supabase
 * Contains only database access logic, no business rules
 */
export class StrategiesRepository extends BaseRepository<Strategies> {
  constructor(client: SupabaseClient) {
    super(client, "strategies");
  }
}
