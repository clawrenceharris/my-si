import { Sessions } from "@/types/tables";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useState } from "react";

export function useVirtualMeeting() {
  const videoClient = useStreamVideoClient();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  async function createVirtualMeeting(
    session: Pick<
      Sessions,
      "scheduled_start" | "topic" | "course_name" | "description"
    >
  ): Promise<Call | null> {
    if (!videoClient || !user) {
      return null;
    }
    try {
      setIsLoading(true);

      const { topic, description, scheduled_start, course_name } = session;

      const id = crypto.randomUUID();

      const call = videoClient.call("default", id);

      await call.getOrCreate({
        data: {
          starts_at: new Date(scheduled_start).toISOString(),
          members: [
            {
              user_id: user.id,
              role: "admin",
            },
          ],
          custom: { topic, description, course_name },
        },
      });

      return call;
    } catch {
      alert("Something went wrong. Please try again later.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }
  return {
    isLoading,
    createVirtualMeeting,
  };
}
