import { AppErrorCode, normalizeError } from "@/shared";
import { profilesRepository } from "../data/profiles.repository";
import { updateProfileSchema } from "./profiles.schema";

import { TablesInsert, TablesUpdate } from "@/types";
import { Profiles } from "@/types/tables";

/**
 * Service layer for profile business logic
 * Handles validation, business rules, and error normalization
 */
export class ProfilesService {
  /**
   * Create a new user profile with validation
   */
  async createProfile(data: TablesInsert<"profiles">): Promise<Profiles> {
    try {
      // Sanitize and process data
      const sanitizedData = this.sanitizeProfileData(data);

      // Create profile
      return await profilesRepository.create(sanitizedData);
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

      return await profilesRepository.getById(userId);
    } catch (error) {
      throw normalizeError(error);
    }
  }

  /**
   * Get current user's profile
   */
  async getCurrentProfile(): Promise<Profiles | null> {
    try {
      return await profilesRepository.getCurrentProfile();
    } catch (error) {
      throw normalizeError(error);
    }
  }

  /**
   * Update user profile with validation
   */
  async updateProfile(
    userId: string,
    data: Partial<TablesUpdate<"profiles">>
  ): Promise<Profiles> {
    try {
      // Validate input data
      const validationResult = updateProfileSchema.safeParse(data);
      if (!validationResult.success) {
        throw validationResult.error;
      }

      // Sanitize and process data
      const sanitizedData = this.sanitizeProfileData(validationResult.data);

      // Update profile
      const updateResult = await profilesRepository.update(
        userId,
        sanitizedData
      );

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
      return await profilesRepository.existsById(userId);
    } catch (error) {
      throw normalizeError(error);
    }
  }

  /**
   * Delete user profile
   */
  async deleteProfile(userId: string): Promise<void> {
    try {
      await profilesRepository.delete(userId);
    } catch (error) {
      throw normalizeError(error);
    }
  }

  /**
   * Sanitize profile data to prevent XSS and ensure data integrity
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private sanitizeProfileData(data: any): any {
    const sanitized = { ...data };

    // Sanitize display name
    if (sanitized.displayName) {
      sanitized.displayName = sanitized.displayName.trim();
    }

    // Sanitize avatar URL
    if (sanitized.avatarUrl) {
      sanitized.avatarUrl = sanitized.avatarUrl.trim();
      // Remove empty string URLs
      if (sanitized.avatarUrl === "") {
        sanitized.avatarUrl = undefined;
      }
    }

    // Sanitize favorite genres
    if (sanitized.favoriteGenres) {
      sanitized.favoriteGenres = [
        ...new Set(
          sanitized.favoriteGenres
            .filter((genre: string) => genre && typeof genre === "string")
            .map((genre: string) => genre.trim())
        ),
      ];
    }

    return sanitized;
  }
}

// Export singleton instance
export const profileService = new ProfilesService();
