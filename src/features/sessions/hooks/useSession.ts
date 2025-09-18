"use client";

import { useSupabaseClient } from "@/providers/SupabaseClientProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionService } from "../domain/sessions.service";
import { SessionsInsert } from "@/types/tables";

export function useSession(sessionId?: string) {
  const client = useSupabaseClient();
  const service = new SessionService(client);
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      if (sessionId) return await service.getSessionById(sessionId);
    },
    enabled: !!sessionId,
  });

  // Mutations
  const createSession = useMutation({
    mutationFn: async (data: SessionsInsert) => {
      return await service.createSession(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });
  const deleteSession = useMutation({
    mutationFn: async () => {
      if (sessionId) return await service.deleteSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
    },
  });

  return {
    isLoading: sessionQuery.isLoading,
    session: sessionQuery.data,
    isCreatingSession: createSession.isPending,
    isDeletingSession: deleteSession.isPending,
    error: sessionQuery.error,
    createSessionError: createSession.error,
    deleteSessionError: deleteSession.error,

    createSession: createSession.mutateAsync,
    deleteSession: deleteSession.mutateAsync,
    refetch: sessionQuery.refetch,
  };
}
