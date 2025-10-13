import {
  LessonCards,
  LessonCardsUpdate,
  Lessons,
  LessonsInsert,
  LessonsUpdate,
} from "@/types/tables";
import { LessonWithStrategies } from "./playbooks.types";
import { PlaybooksRepository } from "../data/playbooks.repository";
import { supabase } from "@/lib/supabase/client";

class PlaybooksService {
  private repository: PlaybooksRepository;

  constructor() {
    this.repository = new PlaybooksRepository(supabase);
  }
  async getAllByUser(userId: string): Promise<Lessons[]> {
    return await this.repository.getAllBy("owner", userId);
  }
  async getPlaybookWithStrategies(
    playbookId: string
  ): Promise<LessonWithStrategies> {
    const lesson = (await this.repository.getById(playbookId)) as Lessons;

    const strategies = await this.repository.getPlaybookStrategies(playbookId);

    return { ...lesson, strategies: strategies as LessonCards[] };
  }

  async getPlaybookStrategies(playbookId: string) {
    return await this.repository.getAllBy(
      "lesson_id",
      playbookId,
      "lesson_cards"
    );
  }
  async createPlaybook(data: LessonsInsert): Promise<Lessons> {
    return await this.repository.create<LessonsInsert>(data);
  }
  async updatePlaybook(
    lessonId: string,
    data: LessonsUpdate
  ): Promise<Lessons> {
    return await this.repository.update<LessonsUpdate>(lessonId, data);
  }
  async updateStrategySteps(strategyId: string, steps: string[]) {
    return await this.repository.updatePlaybookStrategy(strategyId, {
      steps,
    });
  }
  async updatePlaybookStrategy(
    strategyId: string,
    data: LessonCardsUpdate
  ): Promise<LessonCards> {
    return await this.repository.updatePlaybookStrategy(strategyId, data);
  }
  async deletePlaybook(lessonId: string): Promise<void> {
    return await this.repository.delete(lessonId);
  }
  async deletePlaybookStrategy(lessonId: string): Promise<void> {
    return await this.repository.delete(lessonId);
  }

  async reorderStrategies(strategies: { id: string; position: number }[]) {
    return await this.repository.updateStrategyPositions(strategies);
  }
}

export const playbooksService = new PlaybooksService();
