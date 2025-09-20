import { useSupabaseClient } from "@/providers";
import { SessionsService } from "../domain";
import { useQuery } from "@tanstack/react-query";

export function useSession(sessionId: string) {
  const client = useSupabaseClient();
  const service = new SessionsService(client);

  const sessionQuery = useQuery({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      return await service.getSessionById(sessionId);
    },
    enabled: !!sessionId,
  });

  return {
    session: sessionQuery.data,
  };
}
