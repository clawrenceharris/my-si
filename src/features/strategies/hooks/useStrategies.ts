import { useQuery } from "@tanstack/react-query";
import { strategiesService } from "../domain";

export function useStrategies() {
  const strategiesQuery = useQuery({
    queryKey: ["strategies"],
    queryFn: async () => {
      return await strategiesService.getAll();
    },
  });

  return {
    strategies: strategiesQuery.data,
    isLoading: strategiesQuery.isLoading,
    error: strategiesQuery.error,
    refetch: strategiesQuery.refetch,
  };
}
