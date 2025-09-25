// repositories/base.repository.ts
import { SupabaseClient } from "@supabase/supabase-js";

export abstract class BaseRepository<TDomain> {
  protected constructor(
    protected readonly client: SupabaseClient,
    protected readonly tableName: string
  ) {}

  async getById(id: string): Promise<TDomain | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async getSingleBy(column: string, value: string): Promise<TDomain | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq(column, value)
      .maybeSingle();
    if (error || !data) return null;
    return data;
  }

  /**
   * Check if profile exists for user
   */
  async existsById(id: string): Promise<boolean> {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("id")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        if (error.code === "PGRST116") {
          return false;
        }
        throw error;
      }

      return !!data;
    } catch {
      return false;
    }
  }

  async create<T>(data: T): Promise<TDomain> {
    const { data: result, error } = await this.client
      .from(this.tableName)
      .insert<T>(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async update<T>(id: string, updatedFields: T): Promise<TDomain> {
    const { data, error } = await this.client
      .from(this.tableName)
      .update<T>(updatedFields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
  async getAllBy(column: string, value: string): Promise<TDomain[]> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select()
      .eq(column, value);
    if (error) {
      throw error;
    }
    return data || [];
  }
  async getAll(): Promise<TDomain[]> {
    const { data, error } = await this.client.from(this.tableName).select();
    if (error) {
      throw error;
    }
    return data || [];
  }
}
