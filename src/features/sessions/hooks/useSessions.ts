import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionsService } from "../domain";
import { SessionsInsert, SessionsUpdate } from "@/types/tables";

export function useSessions(userId?: string | null) {
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["sessions", userId],
    queryFn: async () => {
      if (userId) return await sessionsService.getAllByUser(userId);
    },
    enabled: !!userId,
  });

  const addSession = useMutation({
    mutationFn: async (data: SessionsInsert) =>
      await sessionsService.addSession(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sessions", userId] }),
  });

  const updateSession = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SessionsUpdate }) =>
      await sessionsService.updateSession(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sessions", userId] }),
  });

  const deleteSession = useMutation({
    mutationFn: async (id: string) => await sessionsService.deleteSession(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sessions", userId] }),
  });

  return {
    isLoading: sessionsQuery.isLoading,
    error: sessionsQuery.error,
    sessions: sessionsQuery.data,
    refetch: sessionsQuery.refetch,

    addSession,
    updateSession,
    deleteSession,
  };
}
