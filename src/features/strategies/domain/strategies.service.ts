import { Strategies } from "@/types/tables";
import { StrategiesRepository } from "../data";
import { supabase } from "@/lib/supabase/client";

class StrategiesService {
  private repository: StrategiesRepository;

  constructor() {
    this.repository = new StrategiesRepository(supabase);
  }
  async getStrategyById(id: string) {
    return await this.repository.getById(id);
  }
  async getStrategyBySlug(slug: string) {
    return await this.repository.getSingleBy("slug", slug);
  }
  async getAll(): Promise<Strategies[]> {
    return await this.repository.getAll();
  }
}
export const strategiesService = new StrategiesService();
