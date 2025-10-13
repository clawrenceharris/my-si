import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { PhoneCall, PhoneOff, Users } from "lucide-react";

interface BreakoutRoomButtonProps {
  isJoined: boolean;
  onJoin: () => void;
  onLeave: () => void;
}

export function BreakoutRoomButton({
  isJoined,

  onJoin,
  onLeave,
}: BreakoutRoomButtonProps) {
  return (
    <div
      className={cn(
        "center-all",
        "bg-secondary-500 fixed z-999 top-3 md:top-5 left-0",
        "text-white w-full p-2 md:px-5 max-w-xs shadow-black/20 flex-1 shadow-md ",
        "rounded-r-2xl justify-between gap-6 hover:shadow-lg transition-shadow duration-200"
      )}
    >
      <div className="center-all gap-2.5">
        <div className={cn("icon-ghost")}>
          <Users />
        </div>
        <h2>Breakout Room</h2>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="tertiary"
          size="icon"
          aria-label="Join Breakout Room"
          className={cn(
            "hover:scale-[1.02]",
            isJoined
              ? "text-destructive-500  hover:bg-destructive-100"
              : "text-primary-400  hover:bg-primary-100"
          )}
          onClick={() => (isJoined ? onLeave() : onJoin())}
        >
          {isJoined ? (
            <PhoneOff fill="var(--color-destructive-500)" />
          ) : (
            <PhoneCall fill="var(--color-primary-400)" />
          )}
        </Button>
      </div>
    </div>
  );
}
