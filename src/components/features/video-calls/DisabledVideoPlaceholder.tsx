import { cn } from "@/lib/utils";
import { User2 } from "lucide-react";
import Image from "next/image";

interface DisabledVideoPreviewProps {
  showsMessage?: boolean;
  className?: string;
  image?: string;
}
export default function DisabledVideoPlaceholder({
  className,
  image,
  showsMessage = true,
}: DisabledVideoPreviewProps) {
  return (
    <div className={cn("disabled-video-container", className)}>
      {showsMessage && (
        <p className="absolute top-0 px-4 py-2 bg-black/50 rounded-b-xl text-sm">
          Your camera is disabled
        </p>
      )}
      <div
        className={`
          relative
          rounded-full
          shadow-xl
          shadow-foreground/20
          w-30 h-30
          backdrop-blur-xl
          flex justify-center items-center
          overflow-hidden
          bg-white/40`}
      >
        {image ? (
          <Image priority src={image} sizes="512" alt="avatar" fill />
        ) : (
          <User2 size={40} />
        )}
      </div>
    </div>
  );
}
