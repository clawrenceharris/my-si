// src/hooks/use-lesson.ts
"use client";

import { useSupabaseClient } from "@/providers/SupabaseClientProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LessonsService } from "../domain/lessons.service";

export function useLesson(lessonId: string) {
  const client = useSupabaseClient();
  const service = new LessonsService(client);
  const queryClient = useQueryClient();

  // Fetch lesson + cards
  const lessonQuery = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => service.getLessonWithCards(lessonId),
    enabled: !!lessonId,
  });

  // Mutations
  const updateCardSteps = useMutation({
    mutationFn: (vars: { cardId: string; steps: string[] }) =>
      service.updateCardSteps(vars.cardId, vars.steps),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
    },
  });

  const reorderCards = useMutation({
    mutationFn: (vars: { id: string; position: number }[]) =>
      service.reorderCards(vars),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", lessonId] });
    },
  });

  return {
    lesson: lessonQuery.data?.lesson,
    cards: lessonQuery.data?.cards ?? [],
    isLoading: lessonQuery.isLoading,
    error: lessonQuery.error,
    updateCardSteps: updateCardSteps.mutate,
    reorderCards: reorderCards.mutate,
    refetch: lessonQuery.refetch,
  };
}
