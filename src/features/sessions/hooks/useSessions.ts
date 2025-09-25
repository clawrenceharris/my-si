import { useSupabaseClient } from "@/providers/SupabaseClientProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionsService } from "../domain";
import { SessionsInsert, SessionsUpdate } from "@/types/tables";

export function useSessions(userId?: string) {
  const client = useSupabaseClient();
  const service = new SessionsService(client);
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["sessions", userId],
    queryFn: async () => {
      if (userId) return await service.getAllByUser(userId);
    },
    enabled: !!userId,
  });

  const addSession = useMutation({
    mutationFn: async (data: SessionsInsert) => await service.addSession(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sessions", userId] }),
  });

  const updateSession = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: SessionsUpdate }) =>
      await service.updateSession(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sessions", userId] }),
  });

  const deleteSession = useMutation({
    mutationFn: async (id: string) => await service.deleteSession(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["sessions", userId] }),
  });

  return {
    sessionsQuery,
    addSession,
    updateSession,
    deleteSession,
  };
}
