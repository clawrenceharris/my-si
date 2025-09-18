"use client";

import { useSupabaseClient } from "@/providers/SupabaseClientProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionService } from "../domain/session.service";
import { CreateSessionInput } from "../domain/session.schema";

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
    mutationFn: async (data: CreateSessionInput) => {
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
    session: sessionQuery.data,
    createSession: createSession.mutateAsync,
    deleteSession: deleteSession.mutateAsync,
    isLoading: sessionQuery.isLoading,
    error: sessionQuery.error,
    refetch: sessionQuery.refetch,
  };
}
