import { normalizeError } from "@/utils/error";

import { Profiles, ProfilesInsert, ProfilesUpdate } from "@/types/tables";
import { ProfilesRepository } from "../data";
import { AppErrorCode } from "@/types/errors";
import { supabase } from "@/lib/supabase/client";

/**
 * Service layer for profile business logic
 *
 */
class ProfileService {
  private repository: ProfilesRepository;
  constructor() {
    this.repository = new ProfilesRepository(supabase);
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

      return await this.repository.getById(userId);
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

export const profileService = new ProfileService();
