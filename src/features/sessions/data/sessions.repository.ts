// src/repositories/LessonsRepository.ts
import { Sessions } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/repositories/base.repository";

export class SessionsRepository extends BaseRepository<Sessions> {
  constructor(client: SupabaseClient) {
    super(client, "sessions");
  }
}
