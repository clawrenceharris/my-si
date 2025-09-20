import { getUserIds } from "@/app/actions";
import { useUser } from "@/providers";
import { Sessions } from "@/types/tables";
import { MemberRequest } from "@stream-io/node-sdk";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export function useVirtualMeeting() {
  const videoClient = useStreamVideoClient();
  const { user, profile } = useUser();

  async function createVirtualMeeting(
    session: Pick<Sessions, "scheduled_start" | "description">
  ): Promise<Call | null> {
    if (!videoClient) {
      return null;
    }

    try {
      const id = crypto.randomUUID();

      const call = videoClient.call("default", id);

      const memberEmails = profile.email ? [profile.email] : [];

      const memberIds = await getUserIds(memberEmails);

      const members: MemberRequest[] = memberIds
        .map((id) => ({ user_id: id, role: "call_member" }))
        .concat({ user_id: user.id, role: "call_member" })
        .filter(
          (v, i, a) => a.findIndex((v2) => v2.user_id === v.user_id) === i
        );

      const starts_at = new Date(
        session.scheduled_start || Date.now()
      ).toISOString();

      await call.getOrCreate({
        data: {
          starts_at,
          members,
          custom: { description: session.description },
        },
      });

      return call;
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again later.");
      return null;
    }
  }
  return {
    createVirtualMeeting,
  };
}
