// src/services/LessonsService.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { Strategies } from "@/types/tables";
import { StrategiesRepository } from "../data";

export class StrategiesService {
  private repository: StrategiesRepository;

  constructor(client: SupabaseClient) {
    this.repository = new StrategiesRepository(client);
  }

  async getAll(): Promise<Strategies[]> {
    return await this.repository.getAll();
  }
}
