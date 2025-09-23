"use client";

import { EmptyState, ErrorState, LoadingState } from "@/components/states";
import { useSession, useSessions } from "@/features/sessions/hooks";
import { useVirtualMeeting } from "@/features/sessions/hooks/useVirtualMeeting";
import useStreamCall from "@/hooks/useStreamCall";
import {
  CallingState,
  ParticipantView,
  StreamCall,
  StreamTheme,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Sessions } from "@/types/tables";
import { ActivityPanel } from "@/components/features";
import useLoadCall from "@/hooks/useLoadCall";
import { CustomParticipantViewUI } from "@/components/features/video-calls/CustomParticipantView";
import { CustomCallControls } from "@/components/features/video-calls/CustomCallControls";
import { CustomVideoPlaceholder } from "@/components/features/video-calls/CustomVideoPlaceholder";
import { usePlaybookEngine } from "@/hooks";

interface VirtualSessionPageProps {
  id: string;
}

export default function VirtualSessionPage({ id }: VirtualSessionPageProps) {
  const { user } = useUser();
  const { session } = useSession(id);
  const { updateSession } = useSessions(user?.id);

  const { createVirtualMeeting, isLoading: sessionLoading } =
    useVirtualMeeting();
  const { call, isLoading: callLoading } = useLoadCall();

  //leave call
  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      if (call) {
        call.leave(); // End the current call session
      }
    });
  }, [call]);

  //join call
  useEffect(() => {
    if (!call) return;
    const joinMeeting = async () => {
      if (call.state.callingState === CallingState.JOINED) {
        return;
      }
      try {
        await call.join();
      } catch (error) {
        console.error(
          error instanceof Error
            ? error.message
            : "An error occured while joining meeting"
        );
        alert("An error occured while joining meeting");
      }
    };

    joinMeeting();
  }, [call]);
  if (callLoading || sessionLoading) {
    return <LoadingState />;
  }
  if (!session) {
    return <ErrorState variant="card" message="No session found." />;
  }
  if (!call) {
    return (
      <EmptyState
        variant="card"
        title="Virtual Meeting not created."
        actionLabel={sessionLoading ? "Loading..." : "Create Meeting"}
        onAction={async () => {
          const call = await createVirtualMeeting(session);
          updateSession.mutate({
            id: session.id,
            data: { call_id: call?.id || null },
          });
        }}
      />
    );
  }

  return (
    <StreamCall call={call}>
      <StreamTheme className="light">
        <MeetingScreen session={session} />
      </StreamTheme>
    </StreamCall>
  );
}

function MeetingScreen({ session }: { session: Sessions | null }) {
  const call = useStreamCall();
  const { user } = useUser();
  const { useCallCreatedBy, useRemoteParticipants, useLocalParticipant } =
    useCallStateHooks();
  const host = useCallCreatedBy();
  const local = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  const [activityPanelOpen, setActivityPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("agenda");

  const isHost = !!host && host.id === user?.id;
  const handleCopy = () => {
    if (!session) return;
    const link = `${window.location.origin}/session/virtual/${session.id}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const engine = usePlaybookEngine(call, {
    onActivityStart: () => {
      setActiveTab("playbook");
      setActivityPanelOpen(true);
    },
    onActivityEnd: () => setActiveTab("agenda"),
  });

  return (
    <div className="flex h-screen">
      {/* {session && (
        <ActivityPanel
          playbookEngine={engine}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isHost={isHost}
          onOpenChange={setActivityPanelOpen}
          open={activityPanelOpen}
          session={session}
        />
      )} */}

      <div className="flex flex-col flex-1">
        {/* Local participant */}
        {local && (
          <div className="flex-1 flex items-center justify-center">
            <div className="relative w-full max-w-4xl aspect-video shadow-md rounded-xl overflow-hidden">
              <ParticipantView
                participant={local}
                ParticipantViewUI={CustomParticipantViewUI}
                VideoPlaceholder={CustomVideoPlaceholder}
              />
            </div>
          </div>
        )}

        {remoteParticipants.length > 0 && (
          <div className="flex flex-1 overflow-auto h-full gap-2 p-2 justify-center">
            {remoteParticipants.map((p) => (
              <div
                key={p.sessionId}
                className="relative w-40 h-full aspect-video rounded-lg overflow-hidden"
              >
                <ParticipantView
                  participant={p}
                  ParticipantViewUI={CustomParticipantViewUI}
                  VideoPlaceholder={CustomVideoPlaceholder}
                />
              </div>
            ))}
          </div>
        )}

        <div className="bg-white fixed bottom-0 left-0 w-full flex justify-center">
          <CustomCallControls
            onPlaybookClick={() => {
              setActivityPanelOpen(true);
            }}
            onShareClick={handleCopy}
          />
        </div>
      </div>
    </div>
  );
}
