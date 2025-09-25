import { useSupabaseClient } from "@/providers/SupabaseClientProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlaybooksService } from "../domain/playbooks.service";
import { LessonCardsUpdate } from "@/types/tables";

export function usePlaybook(playbookId: string | null | undefined) {
  const client = useSupabaseClient();
  const service = new PlaybooksService(client);
  const queryClient = useQueryClient();

  // Fetch playbook + plays
  const playbookQuery = useQuery({
    queryKey: ["playbook", playbookId],
    queryFn: () => {
      if (playbookId) return service.getPlaybookWithStrategies(playbookId);
    },
    enabled: !!playbookId,
  });

  const updateStrategySteps = useMutation({
    mutationFn: async (vars: {
      playbookId: string;
      strategyId: string;
      steps: string[];
    }) =>
      await service.updateStrategySteps(
        vars.playbookId,
        vars.strategyId,
        vars.steps
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playbook", playbookId] });
    },
  });
  const updatePlaybookStrategy = useMutation({
    mutationFn: async (vars: {
      playbookId: string;
      cardSlug: string;
      data: LessonCardsUpdate;
    }) =>
      service.updatePlaybookStrategy(vars.playbookId, vars.cardSlug, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playbook", playbookId] });
    },
  });
  const reorderStrategies = useMutation({
    mutationFn: async (vars: {
      playbookId: string;
      strategies: { id: string; position: number }[];
    }) => service.reorderStrategies(vars.playbookId, vars.strategies),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playbook", playbookId] });
    },
  });

  return {
    playbook: playbookQuery.data,
    isLoading: playbookQuery.isLoading,
    error: playbookQuery.error,
    updatePlaybookStrategy: updatePlaybookStrategy,
    updateStrategySteps: updateStrategySteps.mutateAsync,
    reorderStrategies: reorderStrategies.mutateAsync,
    refetch: playbookQuery.refetch,
  };
}
