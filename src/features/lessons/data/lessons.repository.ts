// src/repositories/LessonsRepository.ts
import { LessonCardsUpdate, Lessons } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";
import { BaseRepository } from "@/repositories/base.repository";
export class LessonRepository extends BaseRepository<Lessons> {
  constructor(client: SupabaseClient) {
    super(client, "lessons");
  }
  async getLessonByTopic(id: string) {
    const { error, data } = await this.client
      .from("lessons")
      .select("id, topic")
      .eq("id", id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  }

  async getLessonCards(lessonId: string) {
    const { error, data } = await this.client
      .from("lesson_cards")
      .select("id,title,phase,steps,category,position")
      .eq("lesson_id", lessonId)
      .order("position");
    if (error) {
      throw error;
    }
    return data;
  }

  async updateCardSteps(cardId: string, steps: string[]) {
    const { error, data } = await this.client
      .from("lesson_cards")
      .update({ steps })
      .eq("id", cardId);
    if (error) {
      throw error;
    }
    return data;
  }
  async updateLessonCard(cardId: string, updatedFields: LessonCardsUpdate) {
    const { data, error } = await this.client
      .from("lesson_cards")
      .update(updatedFields)
      .eq("id", cardId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  async updateCardPositions(cards: { id: string; position: number }[]) {
    const updates = [];

    for (const c of cards) {
      updates.push(this.updateLessonCard(c.id, { position: c.position }));
    }
    try {
      const data = await Promise.all(updates);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
