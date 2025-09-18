import { getUserIds } from "@/app/actions";
import { useSession } from "@/features/sessions/hooks";
import { useUser } from "@clerk/nextjs";
import { MemberRequest, useStreamVideoClient } from "@stream-io/video-react-sdk";

export default function Page() {
    const client = useStreamVideoClient();
    const { user } = useUser();
    const { session } = useSession();

    const createMeeting = async (): Promise<string | null> => {
    if (!client || !user || !session) {
      return null;
    }

    try {
      const id = crypto.randomUUID();

      const call = client.call("default", id);

     
     
      const starts_at = new Date(session.scheduled_start || Date.now()).toISOString();

      await call.getOrCreate({
        data: {
          starts_at,
          members: [{ user_id: user.id, role: "call_member" }],
          custom: {topic: session.topic, description: session.description },
        },
      });

      return call.id;
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again later.");
      return null;
    }
  };
    
    return (
        <>
        
            
        </>
    )
}