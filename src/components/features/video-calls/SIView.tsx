import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { useEffect, useMemo } from "react";
import { CustomParticipantView, ParticipantListView } from "./";
import { usePlayfieldParticipants, useStreamCall } from "@/hooks";

export default function SIView() {
  const { useCallCreatedBy, useParticipants } = useCallStateHooks();
  const host = useCallCreatedBy();
  const participants = useParticipants();
  const call = useStreamCall();
  const hostParticipant = useMemo(
    () => participants.find((p) => p.userId === host?.id),
    [host?.id, participants]
  );
  useEffect(() => {
    const remove = async () => {
      const { members } = await call.queryMembers();

      for (const m of members) {
        if (m.user_id === call.currentUserId) {
          // remove members with no active session
          await call
            .updateCallMembers({ remove_members: [m.user_id] })
            .catch(console.warn);
        }
      }
    };
    remove();
  }, [call]);
  const { pinned } = usePlayfieldParticipants();
  const transformedParticipants = useMemo(
    () =>
      participants.filter((p) => {
        if (p.pin) {
          return false;
        }
        if (p.userId === hostParticipant?.userId && !pinned) {
          return false;
        }
        return true;
      }),
    [hostParticipant?.userId, participants, pinned]
  );

  return (
    <div className="flex w-full h-full justify-center items-center gap-3">
      {/* Pinned  participant view. If no one is pinned show Host */}
      <div className="flex-2/3">
        {pinned ? (
          <CustomParticipantView participant={pinned} />
        ) : (
          hostParticipant && (
            <CustomParticipantView participant={hostParticipant} />
          )
        )}
      </div>
      <div className="flex-1/3 h-full overflow-hidden">
        {/*All other regular participants, excluding the Host (unless someone else is pinned) */}
        <ParticipantListView
          className="faded-col"
          containerClassName="flex-col"
          participants={transformedParticipants}
        />
      </div>
    </div>
  );
}
