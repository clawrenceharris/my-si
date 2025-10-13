import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LessonsInsert, LessonsUpdate } from "@/types/tables";
import { playbooksService } from "../domain";

export function useUserPlaybooks(userId?: string) {
  const queryClient = useQueryClient();

  const playbooksQuery = useQuery({
    queryKey: ["playbooks", userId],
    queryFn: async () => {
      if (userId) return playbooksService.getAllByUser(userId);
    },
    enabled: !!userId,
  });

  const addPlaybook = useMutation({
    mutationFn: async (data: LessonsInsert) =>
      await playbooksService.createPlaybook(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playbooks", userId] }),
  });

  const updatePlaybook = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LessonsUpdate }) =>
      await playbooksService.updatePlaybook(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["playbooks", userId] }),
  });

  const deletePlaybook = useMutation({
    mutationFn: async (id: string) => await playbooksService.deletePlaybook(id),
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
