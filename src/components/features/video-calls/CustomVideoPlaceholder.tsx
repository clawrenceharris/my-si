import { useParticipantViewContext } from "@stream-io/video-react-sdk";
import { User2 } from "lucide-react";

export function CustomVideoPlaceholder() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { participant } = useParticipantViewContext();
  return (
    <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary-400  to-secondary-600 flex justify-center items-center">
      <div className="rounded-full shadow-xl shadow-foreground/20 w-24 h-24 flex justify-center items-center text-primary-300 bg-white">
        <User2 size={40} />
      </div>
    </div>
  );
}
