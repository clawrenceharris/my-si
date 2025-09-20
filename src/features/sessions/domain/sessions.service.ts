// src/services/LessonsService.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { SessionsRepository } from "../data";
import { Sessions, SessionsInsert, SessionsUpdate } from "@/types/tables";

export class SessionsService {
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
  getAllByUser(userId: string): Promise<Sessions[]> {
    return this.repository.getAllByUser(userId);
  }

  addSession(data: SessionsInsert) {
    return this.repository.create(data);
  }

  updateSession(id: string, data: SessionsUpdate) {
    return this.repository.update(id, data);
  }
}
