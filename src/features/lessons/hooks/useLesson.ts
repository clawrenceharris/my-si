"use client";

import { useSupabaseClient } from "@/providers/SupabaseClientProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LessonService } from "../domain/lessons.service";

export function useLesson(lessonId: string | null | undefined) {
  const client = useSupabaseClient();
  const service = new LessonService(client);
  const queryClient = useQueryClient();

  // Fetch lesson + cards
  const lessonQuery = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => {
      if (lessonId) return service.getLessonWithCards(lessonId);
    },
    enabled: !!lessonId,
  });

  // Mutations
  const updateCardSteps = useMutation({
    mutationFn: async (vars: { id: string; steps: string[] }) =>
      await service.updateCardSteps(vars.id, vars.steps),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
    },
  });

  const reorderCards = useMutation({
    mutationFn: async (vars: { id: string; position: number }[]) =>
      await service.reorderCards(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
    },
  });

  return {
    lesson: lessonQuery.data,
    cards: lessonQuery.data?.cards ?? [],
    isLoading: lessonQuery.isLoading,
    error: lessonQuery.error,
    updateCardSteps: updateCardSteps.mutateAsync,
    reorderCards: reorderCards.mutateAsync,
    refetch: lessonQuery.refetch,
  };
}
