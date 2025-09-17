// src/repositories/LessonsRepository.ts
import { Lessons } from "@/types/tables";
import { Tables } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/repositories/base.repository";
export class LessonsRepository extends BaseRepository<
  Lessons,
  Tables<"lessons">
> {
  constructor(client: SupabaseClient) {
    super(client, "lessons");
  }
  async getLessonByTopic(id: string) {
    return this.client
      .from("lessons")
      .select("id, topic")
      .eq("id", id)
      .single();
  }

  async getLessonCards(lessonId: string) {
    return this.client
      .from("lesson_cards")
      .select("id,title,phase,steps,position")
      .eq("lesson_id", lessonId)
      .order("position");
  }

  async updateCardSteps(cardId: string, steps: string[]) {
    return this.client.from("lesson_cards").update({ steps }).eq("id", cardId);
  }

  async updateCardPositions(cards: { id: string; position: number }[]) {
    for (const c of cards) {
      await this.client
        .from("lesson_cards")
        .update({ position: c.position })
        .eq("id", c.id);
    }
  }
}
