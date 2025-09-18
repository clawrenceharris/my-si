// src/services/LessonsService.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { SessionRepository } from "../data";
import { Sessions } from "@/types/tables";
import { CreateSessionInput } from "./";

export class SessionService {
  private repository: SessionRepository;

  constructor(client: SupabaseClient) {
    this.repository = new SessionRepository(client);
  }
  async getSessionById(id: string): Promise<Sessions | null> {
    return await this.repository.getById(id);
  }
  async createSession(data: CreateSessionInput): Promise<Sessions | null> {
    return await this.repository.create(data);
  }
  async deleteSession(id: string): Promise<void> {
    await this.repository.delete(id);
  }
  async getLessonBySessionId(id: string) {
    const { data: lesson, error } = await this.repository.getLessonBySessionId(
      id
    );
    if (error) throw error;

    return { lesson };
  }
}
