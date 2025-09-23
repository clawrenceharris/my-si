import { ProfileService } from "@/features/profile/domain/profile.service";
import { useSupabaseClient } from "@/providers/SupabaseClientProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook for managing user profile data with TanStack Query
 */
export function useProfile(userId?: string) {
  const queryClient = useQueryClient();
  const supabaseClient = useSupabaseClient();
  const profileService = new ProfileService(supabaseClient);

  const profileQuery = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const data = await profileService.getProfile(userId);
      return data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error.message.toLowerCase().includes("not found")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    profile: profileQuery.data,
    loading: profileQuery.isLoading,
    isError: profileQuery.isError,
    error: profileQuery.error,

    invalidate: () =>
      queryClient.invalidateQueries({ queryKey: ["profile", userId] }),
  };
}
