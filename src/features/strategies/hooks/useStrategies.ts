import { useSupabaseClient } from "@/providers/SupabaseClientProvider";
import { useQuery } from "@tanstack/react-query";
import { StrategiesService } from "../domain/strategies.service";

export function useStrategies() {
  const client = useSupabaseClient();
  const service = new StrategiesService(client);

  const strategiesQuery = useQuery({
    queryKey: ["strategies"],
    queryFn: async () => {
      return await service.getAll();
    },
  });

  return {
    strategies: strategiesQuery.data,
    isLoading: strategiesQuery.isLoading,
    error: strategiesQuery.error,
    refetch: strategiesQuery.refetch,
  };
}
