import { SupabaseClient } from "@supabase/supabase-js";
import {
  LessonCards,
  LessonCardsUpdate,
  Lessons,
  LessonsInsert,
  LessonsUpdate,
} from "@/types/tables";
import { LessonWithStrategies } from "./playbooks.types";
import { PlaybooksRepository } from "../data/playbooks.repository";

export class PlaybooksService {
  private repository: PlaybooksRepository;

  constructor(client: SupabaseClient) {
    this.repository = new PlaybooksRepository(client);
  }
  async getAllByUser(userId: string): Promise<Lessons[]> {
    return await this.repository.getAllBy("user_id", userId);
  }
  async getPlaybookWithStrategies(
    lessonId: string
  ): Promise<LessonWithStrategies> {
    const lesson = (await this.repository.getById(lessonId)) as Lessons;

    const strategies = await this.repository.getLessonStrategies(lessonId);

    return { ...lesson, strategies: strategies as LessonCards[] };
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
  async updateStrategySteps(
    lessonId: string,
    strategyId: string,
    steps: string[]
  ) {
    return await this.repository.updatePlaybookStrategy(lessonId, strategyId, {
      steps,
    });
  }
  async updatePlaybookStrategy(
    lessonId: string,
    cardSlug: string,
    data: LessonCardsUpdate
  ): Promise<LessonCards> {
    console.log({ cardSlug });
    return await this.repository.updatePlaybookStrategy(
      lessonId,
      cardSlug,
      data
    );
  }
  async deletePlaybook(lessonId: string): Promise<void> {
    return await this.repository.delete(lessonId);
  }
  async deletePlaybookStrategy(lessonId: string): Promise<void> {
    return await this.repository.delete(lessonId);
  }

  async reorderStrategies(
    playbookId: string,
    strategies: { id: string; position: number }[]
  ) {
    return await this.repository.updateStrategyPositions(
      playbookId,
      strategies
    );
  }
}
