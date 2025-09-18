// src/services/LessonsService.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { LessonRepository } from "../data/lessons.repository";
import { LessonCards, Lessons } from "@/types/tables";
import { LessonWithCards } from "./lessons.types";

export class LessonService {
  private repo: LessonRepository;

  constructor(client: SupabaseClient) {
    this.repo = new LessonRepository(client);
  }

  async getLessonWithCards(id: string): Promise<LessonWithCards> {
    const lesson = (await this.repo.getById(id)) as Lessons;

    const cards = await this.repo.getLessonCards(id);

    return { ...lesson, cards: cards as LessonCards[] };
  }

  async updateCardSteps(cardId: string, steps: string[]) {
    return await this.repo.updateCardSteps(cardId, steps);
  }

  async reorderCards(cards: { id: string; position: number }[]) {
    return await this.repo.updateCardPositions(cards);
  }
}
