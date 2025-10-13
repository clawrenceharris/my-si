import { useQuery } from "@tanstack/react-query";
import { strategiesService } from "../domain";

export function useStrategy(slug: string) {
  const strategyQuery = useQuery({
    queryKey: ["strategy"],
    queryFn: async () => {
      return await strategiesService.getStrategyBySlug(slug);
    },
  });

  return {
    strategy: strategyQuery.data,
    isLoading: strategyQuery.isLoading,
    error: strategyQuery.error,
    refetch: strategyQuery.refetch,
  };
}
