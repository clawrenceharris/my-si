import { SessionsRepository } from "../data";
import { Sessions, SessionsInsert, SessionsUpdate } from "@/types/tables";
import { supabase } from "@/lib/supabase/client";

export class SessionsService {
  private repository: SessionsRepository;

  constructor() {
    this.repository = new SessionsRepository(supabase);
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
  async getAllByUser(userId: string): Promise<Sessions[]> {
    return await this.repository.getAllBy("instructor", userId);
  }

  async addSession(data: SessionsInsert) {
    return await this.repository.create(data);
  }

  async updateSession(id: string, data: SessionsUpdate) {
    return await this.repository.update(id, data);
  }
}

export const sessionsService = new SessionsService();
