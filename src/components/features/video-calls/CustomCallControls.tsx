import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import useStreamCall from "@/hooks/useStreamCall";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import {
  Camera,
  CameraOff,
  LogOut,
  Mic,
  MicOff,
  Notebook,
  Share,
} from "lucide-react";

interface CustomCallControlsProps {
  onShareClick: () => void;
  onPlaybookClick: () => void;
}

export function CustomCallControls({
  onShareClick,
  onPlaybookClick,
}: CustomCallControlsProps) {
  const call = useStreamCall();
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  const micState = useMicrophoneState();
  const camState = useCameraState();

  return (
    <div className="p-4 flex gap-8 items-center">
      <div className="gap-4 flex items-center">
        <Button
          className={`${
            micState.isEnabled
              ? "bg-primary-500"
              : "bg-primary-200 text-primary-400"
          }`}
          size="icon"
          onClick={() =>
            micState.isEnabled
              ? call.microphone.disable()
              : call.microphone.enable()
          }
        >
          {micState.isEnabled ? <Mic /> : <MicOff />}
        </Button>
        <Button
          size="icon"
          className={`${
            camState.isEnabled
              ? "bg-primary-500"
              : "bg-primary-200 text-primary-400"
          }`}
          onClick={() =>
            camState.isEnabled ? call.camera.disable() : call.camera.enable()
          }
        >
          {camState.isEnabled ? <Camera /> : <CameraOff />}
        </Button>
        <Button
          size="icon"
          className="bg-primary-200 text-primary-400"
          onClick={onShareClick}
        >
          {<Share />}
        </Button>
        <Button
          size="icon"
          className="bg-primary-200 text-primary-400"
          onClick={onPlaybookClick}
        >
          <Notebook />
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="destructive" onClick={() => call.leave()}>
            <LogOut />
            Leave
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => call.endCall()}
          >
            Leave Call
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">End Call</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
