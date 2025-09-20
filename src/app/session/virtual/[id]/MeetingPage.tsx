"use client";

import AudioVolumeIndicator from "@/components/features/video-calls/AudioVolumeIndicator";
import { Button } from "@/components/ui";
import FlexibleCallLayout from "@/components/features/video-calls/FlexibleCallLayout";
import PermissionPrompt from "@/components/features/video-calls/PermissionPrompt";
import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { useSession, useSessions } from "@/features/sessions/hooks";
import { useVirtualMeeting } from "@/features/sessions/hooks/useVirtualMeeting";
import useStreamCall from "@/hooks/useStreamCall";
import { useUser } from "@/providers";
import {
  Call,
  CallingState,
  DeviceSettings,
  StreamCall,
  StreamTheme,
  VideoPreview,
  useCallStateHooks,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface MeetingPageProps {
  id: string;
}

export default function MeetingPage({ id }: MeetingPageProps) {
  const { user } = useUser();
  const { session } = useSession(id);
  const { updateSession } = useSessions(user.id);
  const router = useRouter();
  const { createVirtualMeeting } = useVirtualMeeting();
  const client = useStreamVideoClient();

  const [call, setCall] = useState<Call>();
  const [callLoading, setCallLoading] = useState(true);
  useEffect(() => {
    async function loadCall() {
      setCallLoading(true);

      if (!client) return;

      const { calls } = await client.queryCalls({
        filter_conditions: { id: session?.call_id },
      });

      if (calls.length > 0) {
        const call = calls[0];

        await call.get();

        setCall(call);
      }

      setCallLoading(false);
    }
    loadCall();
  }, [client, session?.call_id]);

  if (callLoading) {
    return <LoadingState />;
  }

  if (!call && session) {
    return (
      <EmptyState
        variant="card"
        title="Virtual Meeting not created."
        actionLabel="Create Meeting"
        onAction={async () => {
          const call = await createVirtualMeeting(session);
          await updateSession.mutateAsync({
            id: session.id,
            data: { call_id: call?.id },
          });
          router.refresh();
        }}
      />
    );
  }
  if (!call) {
    return (
      <ErrorState
        title="Session not found"
        message="We could not find this session. Make sure you created it and set the mode to virtual."
        retryLabel="Create Session"
        onRetry={() => router.replace("/sessions")}
      />
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme>
        <MeetingScreen />
      </StreamTheme>
    </StreamCall>
  );
}

function MeetingScreen() {
  const call = useStreamCall();

  const [setupComplete, setSetupComplete] = useState(false);

  async function handleSetupComplete() {
    call.join();
    setSetupComplete(true);
  }

  const description = call.state.custom.description;

  return (
    <div className="space-y-6">
      {description && (
        <p className="text-center">
          Meeting description: <span className="font-bold">{description}</span>
        </p>
      )}
      {setupComplete ? (
        <CallUI />
      ) : (
        <SetupUI onSetupComplete={handleSetupComplete} />
      )}
    </div>
  );
}

interface SetupUIProps {
  onSetupComplete: () => void;
}

function SetupUI({ onSetupComplete }: SetupUIProps) {
  const call = useStreamCall();

  const { useMicrophoneState, useCameraState } = useCallStateHooks();

  const micState = useMicrophoneState();
  const camState = useCameraState();

  const [micCamDisabled, setMicCamDisabled] = useState(false);

  useEffect(() => {
    if (micCamDisabled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [micCamDisabled, call]);

  if (!micState.hasBrowserPermission || !camState.hasBrowserPermission) {
    return <PermissionPrompt />;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <h1 className="text-center text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center gap-3">
        <AudioVolumeIndicator />
        <DeviceSettings />
      </div>
      <label className="flex items-center gap-2 font-medium">
        <input
          type="checkbox"
          checked={micCamDisabled}
          onChange={(e) => setMicCamDisabled(e.target.checked)}
        />
        Join with mic and camera off
      </label>
      <Button onClick={onSetupComplete}>Join meeting</Button>
    </div>
  );
}

function CallUI() {
  const { useCallCallingState } = useCallStateHooks();

  const callingState = useCallCallingState();

  if (callingState !== CallingState.JOINED) {
    return <Loader2 className="mx-auto animate-spin" />;
  }

  return <FlexibleCallLayout />;
}
