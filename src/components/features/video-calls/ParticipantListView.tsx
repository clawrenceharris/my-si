import { StreamVideoParticipant } from "@stream-io/video-react-sdk";
import { CustomParticipantView } from ".";
import { cn } from "@/lib/utils";

interface ParticipantGridProps {
  participants: StreamVideoParticipant[];
  className?: string;
  containerClassName?: string;
}

export default function ParticipantListView({
  participants,
  className,
  containerClassName,
}: ParticipantGridProps) {
  return (
    <div
      className={cn(
        "faded-row relative w-full overflow-hidden h-full",
        className
      )}
    >
      <div
        className={cn(
          "w-full px-4 pb-4 flex gap-4 h-full overflow-auto snap-x snap-mandatory scrollbar-hide",
          containerClassName
        )}
      >
        {participants.map((p) => (
          <div
            key={p.sessionId}
            className="
            flex-shrink-0 snap-start
            aspect-[4/3]
           
            rounded-xl overflow-hidden
            bg-gradient-to-br from-primary-400/40 to-secondary-600/40
            border border-white/20 shadow-lg
            flex items-center justify-center
            transition-transform duration-200 hover:scale-[1.02]
          "
          >
            <CustomParticipantView participant={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
