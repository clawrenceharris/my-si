import { BaseRepository } from "@/repositories/base.repository";
import { LessonCards, LessonCardsUpdate, Lessons } from "@/types/tables";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Repository for playbooks (lesson plans) data operations using Supabase
 * Contains only database access logic, no business rules
 */
export class PlaybooksRepository extends BaseRepository<Lessons> {
  constructor(client: SupabaseClient) {
    super(client, "lessons");
  }

  async getLessonStrategies(lessonId: string): Promise<LessonCards[]> {
    const { error, data } = await this.client
      .from("lesson_cards")
      .select("*")
      .eq("lesson_id", lessonId)
      .order("position");
    if (error) {
      throw error;
    }
    return data;
  }
  async updatePlaybookStrategy(
    lessonId: string,
    cardSlug: string,
    data: LessonCardsUpdate
  ): Promise<LessonCards> {
    console.log({ cardSlug });
    const { error, data: card } = await this.client
      .from("lesson_cards")
      .update<LessonCardsUpdate>(data)
      .eq("card_slug", cardSlug)
      .eq("lesson_id", lessonId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return card;
  }

  async updateStrategyPositions(
    lessonId: string,
    strategies: { id: string; position: number }[]
  ) {
    const updates: Promise<LessonCards>[] = [];

    for (const s of strategies) {
      updates.push(
        this.updatePlaybookStrategy(lessonId, s.id, { position: s.position })
      );
    }
    try {
      const data = await Promise.all(updates);
      return data;
    } catch (error) {
      throw error;
    }
  }
}
