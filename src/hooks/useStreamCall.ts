import { useCall, useStreamVideoClient } from "@stream-io/video-react-sdk";

export function useStreamCall() {
  const call = useCall();
  const client = useStreamVideoClient();
  if (!call || !client) {
    throw new Error(
      "useStreamCall must be used within a StreamCall component with a valid call prop."
    );
  }
  return call;
}
