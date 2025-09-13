import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../domain/profiles.service";
import type {
  CreateProfileData,
  UpdateProfileData,
} from "../domain/profiles.types";

/**
 * Hook for managing user profile data with TanStack Query
 */
export function useProfileActions(userId: string) {
  const queryClient = useQueryClient();
  // Query for getting user profile

  // Mutation for creating profile
  const createProfileMutation = useMutation({
    mutationFn: async (data: CreateProfileData) => {
      const profile = await profileService.createProfile(data);
      return profile;
    },
    onError: (error) => {
      console.log(error);
    },
    onSuccess: (data) => {
      // Update cache with new profile
      queryClient.setQueryData(["profile", data.userId], data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });

  // Mutation for updating profile
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return await profileService.updateProfile(userId, data);
    },
    onSuccess: (data) => {
      // Update cache with updated profile
      queryClient.setQueryData(["profile", userId], data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });

  // Mutation for deleting profile
  const deleteProfileMutation = useMutation({
    mutationFn: async () => {
      return await profileService.deleteProfile(userId);
    },
    onSuccess: () => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ["profile", userId] });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
  });

  // Function to update last active

  // Function to check if profile exists
  const checkProfileExists = async (userId: string): Promise<boolean> => {
    try {
      return await profileService.profileExists(userId);
    } catch {
      return false;
    }
  };

  return {
    // Mutations
    createProfile: createProfileMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    deleteProfile: deleteProfileMutation.mutate,

    // Mutation states
    isCreating: createProfileMutation.isPending,
    isUpdating: updateProfileMutation.isPending,
    isDeleting: deleteProfileMutation.isPending,

    // Mutation errors
    createError: createProfileMutation.error,
    updateError: updateProfileMutation.error,
    deleteError: deleteProfileMutation.error,

    // Utility functions
    checkProfileExists,
  };
}
