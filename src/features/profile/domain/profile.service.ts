import { AppErrorCode, normalizeError } from "@/shared";

import { Profiles, ProfilesInsert, ProfilesUpdate } from "@/types/tables";
import { ProfilesRepository } from "../data/profiles.repository";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Service layer for profile business logic
 * Handles validation, business rules, and error normalization
 */
export class ProfileService {
  private repository;
  constructor(client: SupabaseClient) {
    this.repository = new ProfilesRepository(client);
  }

  /**
   * Create a new user profile with validation
   */
  async createProfile(data: ProfilesInsert): Promise<Profiles> {
    try {
      // Create profile
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

      return await this.repository.getProfile(userId);
    } catch (error) {
      throw normalizeError(error);
    }
  }

  /**
   * Update user profile with validation
   */
  async updateProfile(userId: string, data: ProfilesUpdate): Promise<Profiles> {
    try {
      const updateResult = await this.repository.update(userId, data);

      return updateResult;
    } catch (error) {
      throw normalizeError(error);
    }
  }

  /**
   * Check if profile exists for user
   */
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
