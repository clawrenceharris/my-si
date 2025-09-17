import { normalizeError } from "@/shared/errors";
import type { OnboardingData } from "./onboarding.types";
import { ProfileService } from "./profile.service";
import { SupabaseClient } from "@supabase/supabase-js";

interface OnboardingResult {
  success: boolean;
  error?: string;
}

const STORAGE_KEY = "onboarding_progress";

export class OnboardingService {
  private profileService;
  constructor(client: SupabaseClient) {
    this.profileService = new ProfileService(client);
  }

  /**
   * Complete the onboarding process by saving user data
   */
  async completeOnboarding(data: OnboardingData): Promise<OnboardingResult> {
    try {
      // Validate required fields
      if (!data.role) {
        return { success: false, error: "Role is required" };
      }

      // Prepare profile updates
      const profileUpdates: Record<string, unknown> = {
        role: data.role,
        onboarding_complete: true,
      };

      // Add courses if provided (for SI Leaders)
      if (data.coursesInstructed && data.coursesInstructed.length > 0) {
        profileUpdates.courses_instructed = data.coursesInstructed;
      }

      // Update user profile
      // await this.profileService.updateCurrentProfile(profileUpdates);

      // Clear progress from storage
      await this.clearProgress();

      return { success: true };
    } catch (error) {
      const normalizedError = normalizeError(error);

      // Determine specific error message based on the operation that failed
      let errorMessage = "Failed to complete onboarding";
      if (normalizedError.message.includes("profile")) {
        errorMessage = "Failed to update profile";
      }

      return { success: false, error: errorMessage };
    }
  }

  /**
   * Save onboarding progress to local storage
   */
  async saveProgress(data: OnboardingData): Promise<OnboardingResult> {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      return { success: true };
    } catch {
      return { success: false, error: "Failed to save progress" };
    }
  }

  /**
   * Load onboarding progress from local storage
   */
  async loadProgress(): Promise<OnboardingData> {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      }
      return {};
    } catch {
      return {};
    }
  }

  /**
   * Clear onboarding progress from local storage
   */
  async clearProgress(): Promise<void> {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Silently fail - not critical
    }
  }

  /**
   * Check if user needs onboarding
   */
  async needsOnboarding(userId: string): Promise<boolean> {
    try {
      const profile = await this.profileService.getProfile(userId);

      // User needs onboarding if onboarding_complete is false or null
      return !profile?.onboarding_completed;
    } catch {
      // If we can't check, assume they need onboarding
      return true;
    }
  }
}
