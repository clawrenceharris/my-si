import { useQuery } from "@tanstack/react-query";
import { playbooksService } from "../domain";

export function usePlaybookStrategies(playbookId?: string) {
  const strategiesQuery = useQuery({
    queryKey: ["playbook-strategies", playbookId],
    queryFn: async () => {
      if (playbookId) return playbooksService.getPlaybookStrategies(playbookId);
    },
    enabled: !!playbookId,
  });

  return {
    strategies: strategiesQuery.data,
    isLoadingPlaybooks: strategiesQuery.isLoading,
    error: strategiesQuery.error,
  };
}
