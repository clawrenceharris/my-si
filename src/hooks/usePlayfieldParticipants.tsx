import { useCallback, useMemo } from "react";
import { useStreamCall } from "./useStreamCall";
import {
  StreamVideoParticipant,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

interface UsePlayfieldParticipantsReturn {
  /**
   * Pins the participant and/or unpins already pinned participants.
   * @param participant The participant to pin or unpin
   */
  togglePinParticipant: (participant: StreamVideoParticipant) => void;
  /**
   * The currently pinned participants. Null if no one is pinned.
   */
  pinned: StreamVideoParticipant | null;
}

export function usePlayfieldParticipants(): UsePlayfieldParticipantsReturn {
  const call = useStreamCall();
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();

  const pinned = useMemo(() => participants.find((p) => p.pin), [participants]);

  const togglePinParticipant = useCallback(
    (participant: StreamVideoParticipant) => {
      if (participant.pin) {
        call.unpin(participant.sessionId);
        return;
      }
      if (pinned) {
        call.unpin(pinned.sessionId);
      }
      call.pin(participant.sessionId);
    },
    [call, pinned]
  );

  return { togglePinParticipant, pinned: pinned || null };
}
