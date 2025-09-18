// src/services/LessonsService.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { SessionsRepository } from "../data";
import { Sessions, SessionsInsert } from "@/types/tables";

export class SessionService {
  private repository: SessionsRepository;

  constructor(client: SupabaseClient) {
    this.repository = new SessionsRepository(client);
  }
  async getSessionById(id: string): Promise<Sessions | null> {
    return await this.repository.getById(id);
  }
  async createSession(data: SessionsInsert): Promise<Sessions | null> {
    return await this.repository.create<SessionsInsert>(data);
  }
  async deleteSession(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
