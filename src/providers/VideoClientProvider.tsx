"use client";

import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { getToken } from "../app/actions";
import { LoadingState } from "@/components/states";
import { useAuth } from "@/features/auth/hooks";

interface ClientProviderProps {
  children: React.ReactNode;
}

export default function VideoClientProvider({ children }: ClientProviderProps) {
  const videoClient = useInitializeVideoClient();

  if (!videoClient) {
    return <LoadingState />;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}

function useInitializeVideoClient() {
  const { user, isLoading: loadingUser } = useAuth();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null
  );

  useEffect(() => {
    if (loadingUser) return;

    let streamUser: User;

    if (user?.id) {
      streamUser = {
        id: user.id,
        name: user.user_metadata.first_name || user.id.slice(4),
      } as User;
    } else {
      const id = crypto.randomUUID();
      streamUser = {
        id,
        type: "guest",
        name: `Guest ${id}`,
      };
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;

    if (!apiKey) {
      throw new Error("Stream API key not set");
    }

    const client = StreamVideoClient.getOrCreateInstance({
      apiKey,
      user: streamUser,

      tokenProvider: user?.id ? getToken : undefined,
    });

    setVideoClient(client);

    return () => {
      // client.disconnectUser();
      setVideoClient(null);
    };
  }, [loadingUser, user]);

  return videoClient;
}
