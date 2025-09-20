// src/repositories/LessonsRepository.ts
import { Sessions } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/repositories/base.repository";

export class SessionsRepository extends BaseRepository<Sessions> {
  constructor(client: SupabaseClient) {
    super(client, "sessions");
  }

  async getAllByUser(userId: string): Promise<Sessions[]> {
    const { data, error } = await this.client
      .from("sessions")
      .select("*")
      .eq("leader_id", userId)
      .order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return data;
  }
}
