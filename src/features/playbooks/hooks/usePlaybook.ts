import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { playbooksService } from "../domain/playbooks.service";
import { LessonCardsUpdate } from "@/types/tables";

export function usePlaybook(playbookId: string | null | undefined) {
  const queryClient = useQueryClient();

  const playbookQuery = useQuery({
    queryKey: ["playbook", playbookId],
    queryFn: async () => {
      if (playbookId)
        return await playbooksService.getPlaybookWithStrategies(playbookId);
    },
    enabled: !!playbookId,
  });

  const updateStrategySteps = useMutation({
    mutationFn: async (vars: { strategyId: string; steps: string[] }) =>
      await playbooksService.updateStrategySteps(vars.strategyId, vars.steps),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playbook", playbookId] });
    },
  });
  const updatePlaybookStrategy = useMutation({
    mutationFn: async (vars: { strategyId: string; data: LessonCardsUpdate }) =>
      playbooksService.updatePlaybookStrategy(vars.strategyId, vars.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playbook", playbookId] });
    },
  });
  const reorderStrategies = useMutation({
    mutationFn: async (vars: {
      playbookId: string;
      strategies: { id: string; position: number }[];
    }) => playbooksService.reorderStrategies(vars.strategies),
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
    isUpdating:
      updatePlaybookStrategy.isPending ||
      updatePlaybookStrategy.isPending ||
      reorderStrategies.isPending ||
      updateStrategySteps.isPending,
    reorderStrategies: reorderStrategies.mutateAsync,
    refetch: playbookQuery.refetch,
  };
}
