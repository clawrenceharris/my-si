// repositories/base.repository.ts
import { SupabaseClient } from "@supabase/supabase-js";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

export abstract class BaseRepository<TDomain, TDb> {
  protected constructor(
    protected readonly client: SupabaseClient,
    protected readonly tableName: string
  ) {}

  protected toDomain(row: TDb): TDomain {
    return camelcaseKeys(row as Record<string, unknown>, {
      deep: true,
    }) as unknown as TDomain;
  }

  protected fromDomain(entity: TDomain): TDb {
    return snakecaseKeys(entity as Record<string, unknown>, {
      deep: true,
    }) as unknown as TDb;
  }

  async getById(id: string): Promise<TDomain | null> {
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async getBy(column: string, value: string): Promise<TDomain | null> {
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

  async create(data: Partial<TDomain>): Promise<TDomain> {
    const { data: result, error } = await this.client
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async update(id: string, entity: Partial<TDomain>): Promise<TDomain> {
    const row = this.fromDomain(entity as TDomain);
    const { data, error } = await this.client
      .from(this.tableName)
      .update(row)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return this.toDomain(data as TDb);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client
      .from(this.tableName)
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}
