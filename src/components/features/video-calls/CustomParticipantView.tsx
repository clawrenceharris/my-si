import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui";
import { usePlayfieldParticipants, useStreamCall } from "@/hooks";
import { cn } from "@/lib/utils";
import {
  ParticipantView,
  StreamVideoParticipant,
} from "@stream-io/video-react-sdk";
import {
  Camera,
  CameraOff,
  Mic,
  MicOff,
  MoreVertical,
  Pin,
} from "lucide-react";
import { DisabledVideoPlaceholder } from "./";

interface CustomParticipantViewProps {
  participant: StreamVideoParticipant;
  className?: string;
}

export default function CustomParticipantView({
  participant,
  className,
}: CustomParticipantViewProps) {
  const call = useStreamCall();
  const { togglePinParticipant } = usePlayfieldParticipants();
  return (
    <div
      className={cn(
        "relative group  w-full  aspect-[4/3] overflow-hidden rounded-xl shadow-md border-4",
        participant.isSpeaking ? "border-green-400" : "border-white",

        className
      )}
    >
      <ParticipantView
        muteAudio
        participant={participant}
        ParticipantViewUI={<></>}
        VideoPlaceholder={() => (
          <DisabledVideoPlaceholder
            image={participant.image}
            showsMessage={false}
          />
        )}
      />
      {/* Name badge */}
      <div className="absolute flex gap-1  top-2 left-2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
        <span className="max-w-13 line-clamp-1">
          {participant.name || "Gues"}
        </span>

        <span>{call.currentUserId === participant.userId ? "(You)" : ""}</span>
        <span className="flex ml-1 gap-1">
          {participant.videoStream?.active ? (
            <Camera size={15} />
          ) : (
            <CameraOff size={15} />
          )}
          {participant.audioStream?.active ? (
            <Mic size={15} />
          ) : (
            <MicOff size={15} />
          )}
        </span>
      </div>
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => togglePinParticipant(participant)}
          aria-label="Pin participant"
          className={cn(
            "center-all rounded-full p-1.5 transition-all",
            "bg-black/50 text-white hover:bg-black/70",
            "opacity-0 group-hover:opacity-100",
            participant.pin && "opacity-100 bg-primary-500"
          )}
        >
          <Pin
            size={15}
            className={cn(participant.pin && "fill-white text-white")}
          />
        </button>
        {call.isCreatedByMe && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "center-all rounded-full p-1.5 transition-all",
                "bg-black/50 text-white hover:bg-black/70",
                "opacity-0 group-hover:opacity-100"
              )}
            >
              <MoreVertical size={15} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => call.kickUser({ user_id: participant.userId })}
              >
                Kick
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
