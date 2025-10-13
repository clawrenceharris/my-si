import { useStreamCall } from "@/hooks";
import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { useEffect, useRef } from "react";
import { DisabledVideoPlaceholder } from "./";

interface CustomVideoPreviewProps {
  image: string;
  className?: string;
}

export default function CustomVideoPreview({
  className,
  image,
}: CustomVideoPreviewProps) {
  const call = useStreamCall();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { useCameraState } = useCallStateHooks();
  const { mediaStream, isEnabled } = useCameraState();
  useEffect(() => {
    if (!call) return;

    let track: MediaStreamTrack | null | undefined = null;

    const startCamera = async () => {
      // Enable camera
      track = mediaStream?.getVideoTracks()[0];

      if (videoRef.current && mediaStream) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    };

    startCamera();

    return () => {
      if (track) {
        track.stop();
      }
    };
  }, [call, mediaStream]);

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      {isEnabled ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover bg-black"
        />
      ) : (
        <DisabledVideoPlaceholder image={image} />
      )}
    </div>
  );
}
