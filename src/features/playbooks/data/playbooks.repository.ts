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

  async getPlaybookStrategies(playbookId: string): Promise<LessonCards[]> {
    const { error, data } = await this.client
      .from("lesson_cards")
      .select()
      .eq("lesson_id", playbookId)
      .order("position");
    if (error) {
      throw error;
    }
    return data;
  }
  async updatePlaybookStrategy(
    strategyId: string,
    data: LessonCardsUpdate
  ): Promise<LessonCards> {
    const { error, data: card } = await this.client
      .from("lesson_cards")
      .update<LessonCardsUpdate>(data)
      .eq("id", strategyId)
      .select()
      .single();
    if (error) {
      throw error;
    }
    return card;
  }

  async updateStrategyPositions(
    strategies: { id: string; position: number }[]
  ) {
    const updates: Promise<LessonCards>[] = [];
    for (const s of strategies) {
      const phase: LessonCards["phase"] =
        s.position === 0
          ? "warmup"
          : s.position === 1
          ? "workout"
          : s.position === 2
          ? "closer"
          : "warmup";

      updates.push(
        this.updatePlaybookStrategy(s.id, { position: s.position, phase })
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
