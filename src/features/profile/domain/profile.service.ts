import { normalizeError } from "@/utils/errorUtils";

import { Profiles, ProfilesInsert, ProfilesUpdate } from "@/types/tables";
import { ProfilesRepository } from "../data";
import { SupabaseClient } from "@supabase/supabase-js";
import { AppErrorCode } from "@/types/errors";

/**
 * Service layer for profile business logic
 *
 */
export class ProfileService {
  private repository: ProfilesRepository;
  constructor(client: SupabaseClient) {
    this.repository = new ProfilesRepository(client);
  }

  /**
   * Create a new user profile
   */
  async createProfile(data: ProfilesInsert): Promise<Profiles> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw normalizeError(error);
    }
  }

  /**
   * Get user profile by user ID
   */
  async getProfile(userId: string): Promise<Profiles | null> {
    try {
      if (!userId) {
        throw new Error(AppErrorCode.PERMISSION_DENIED);
      }

      return await this.repository.getBy("user_id", userId);
    } catch (error) {
      throw normalizeError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: ProfilesUpdate): Promise<Profiles> {
    try {
      const updateResult = await this.repository.update(userId, data);

      return updateResult;
    } catch (error) {
      throw normalizeError(error);
    }
  }

  async profileExists(userId: string): Promise<boolean> {
    try {
      return await this.repository.existsById(userId);
    } catch (error) {
      throw normalizeError(error);
    }
  }

  /**
   * Delete user profile
   */
  async deleteProfile(userId: string): Promise<void> {
    try {
      await this.repository.delete(userId);
    } catch (error) {
      throw normalizeError(error);
    }
  }
}
