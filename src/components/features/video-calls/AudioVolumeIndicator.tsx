import { useEffect, useState } from "react";
import {
  createSoundDetector,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
interface AudioVolumeIndicatorProps {
  className?: string;
}

export default function AudioVolumeIndicator({
  className,
}: AudioVolumeIndicatorProps) {
  const { useMicrophoneState } = useCallStateHooks();
  const { isEnabled, mediaStream } = useMicrophoneState();
  const [audioLevel, setAudioLevel] = useState(0);
  useEffect(() => {
    if (!isEnabled || !mediaStream) return;
    const disposeSoundDetector = createSoundDetector(
      mediaStream,
      ({ audioLevel: al }) => setAudioLevel(al),
      { detectionFrequencyInMs: 80, destroyStreamOnStop: false }
    );
    return () => {
      disposeSoundDetector().catch(console.error);
    };
  }, [isEnabled, mediaStream]);
  return (
    <div
      className={cn(
        "relative flex text-white items-center justify-center rounded-full w-12 h-12",
        className
      )}
    >
      <Mic className="z-2" size={25} />

      {/* Green "fill" background */}
      <div className="absolute w-1.5 z-1 h-3.5 bottom-5 left-1/2 scale-y-[-1] -translate-x-1/2 ">
        <div
          className="w-full  bg-primary-400 rounded-t-full"
          style={{
            height: `${Math.min(audioLevel, 100)}%`,
            transition: "height 10ms linear",
          }}
        />
      </div>
    </div>
  );
}
