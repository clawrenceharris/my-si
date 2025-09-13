import { profileService } from "@/features/profile/domain/profiles.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for managing user profile data with TanStack Query
 */
export function useProfile(userId: string) {
  const queryClient = useQueryClient();
  // Query for getting user profile
  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const data = await profileService.getProfile(userId);
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if profile not found
      if (error.message.toLowerCase().includes("not found")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    // Query state
    profile: profileQuery.data,
    loading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,

    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: ["profile", userId] }),
  };
}
