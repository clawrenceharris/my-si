import { useParticipantViewContext } from "@stream-io/video-react-sdk";

export const CustomParticipantViewUIBar = () => {
  const { participant } = useParticipantViewContext();
  return (
    <div className="bar-participant-name">
      {participant.name || participant.userId}
    </div>
  );
};
export const CustomParticipantViewUI = () => {
  const { participant } = useParticipantViewContext();
  return (
    <div className="text-sm text-white ">
      <span className="absolute px-4 py-2 left-2 bottom-2 bg-black/60 backdrop-blur-xl rounded-full line-clamp-1">
        {participant.name || participant.userId}
      </span>
    </div>
  );
};

export const CustomParticipantViewUISpotlight = () => {
  const { participant } = useParticipantViewContext();
  return (
    <div className="absolute bottom-0 spotlight-participant-name">
      {participant.name || participant.userId}
    </div>
  );
};
