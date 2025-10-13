import { sessionsService } from "../domain";
import { useQuery } from "@tanstack/react-query";

export function useSession(sessionId: string) {
  const sessionQuery = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      return await sessionsService.getSessionById(sessionId);
    },
    enabled: !!sessionId,
  });

  return {
    session: sessionQuery.data,
    isLoading: sessionQuery.isLoading,
    error: sessionQuery.error,
  };
}
