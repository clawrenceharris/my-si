// src/services/LessonsService.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { LessonsRepository } from "../data/lessons.repository";

export class LessonsService {
  private repo: LessonsRepository;

  constructor(client: SupabaseClient) {
    this.repo = new LessonsRepository(client);
  }

  async getLessonWithCards(id: string) {
    const lesson = await this.repo.getById(id);

    const { data: cards, error: ce } = await this.repo.getLessonCards(id);
    if (ce) throw ce;

    return { lesson, cards };
  }

  async updateCardSteps(cardId: string, steps: string[]) {
    const { error } = await this.repo.updateCardSteps(cardId, steps);
    if (error) throw error;
  }

  async reorderCards(cards: { id: string; position: number }[]) {
    await this.repo.updateCardPositions(cards);
  }
}
