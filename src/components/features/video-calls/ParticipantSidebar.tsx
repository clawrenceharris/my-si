import { StreamVideoParticipant } from "@stream-io/video-react-sdk";
import { CustomParticipantView } from "./";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui";

interface ParticipantSidebarProps {
  participants: StreamVideoParticipant[];
}
export default function ParticipantSidebar({
  participants,
}: ParticipantSidebarProps) {
  return (
    // <div className="overflow-auto w-full p-5 flex flex-row mx-auto  lg:flex-col gap-3 rounded-xl ">

    <Carousel className="h-50">
      <CarouselContent className="h-50">
        {participants.map((p) => (
          <CarouselItem
            className="align-center h-50 basis-1/2"
            key={p.sessionId}
          >
            <CustomParticipantView participant={p} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
    </Carousel>
  );
}
