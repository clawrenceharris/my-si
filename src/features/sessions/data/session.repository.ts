// src/repositories/LessonsRepository.ts
import { Sessions } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/repositories/base.repository";

export class SessionRepository extends BaseRepository<Sessions> {
  constructor(client: SupabaseClient) {
    super(client, "lessons");
  }

  async getLessonBySessionId(sessionId: string) {
    return this.client
      .from("sessions")
      .select("id, lessons:lessonId(*)")
      .eq("session_id", sessionId)
      .order("position");
  }
}
