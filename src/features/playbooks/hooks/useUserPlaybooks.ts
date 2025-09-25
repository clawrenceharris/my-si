import { useSupabaseClient } from "@/providers/SupabaseClientProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlaybooksService } from "../domain";
import { LessonsInsert, LessonsUpdate } from "@/types/tables";

export function useUserPlaybooks(userId?: string) {
  const client = useSupabaseClient();
  const service = new PlaybooksService(client);
  const queryClient = useQueryClient();

  const playbooksQuery = useQuery({
    queryKey: ["playbooks", userId],
    queryFn: async () => {
      if (userId) return service.getAllByUser(userId);
    },
    enabled: !!userId,
  });

  const addPlaybook = useMutation({
    mutationFn: async (data: LessonsInsert) =>
      await service.createPlaybook(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playbooks", userId] }),
  });

  const updatePlaybook = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LessonsUpdate }) =>
      await service.updatePlaybook(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playbooks", userId] }),
  });

  const deletePlaybook = useMutation({
    mutationFn: async (id: string) => await service.deletePlaybook(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playbooks", userId] }),
  });

  return {
    playbooks: playbooksQuery.data,
    isLoadingPlaybooks: playbooksQuery.isLoading,
    error: playbooksQuery.error,
    addPlaybook,
    updatePlaybook,
    deletePlaybook,
  };
}
