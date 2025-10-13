import { useState, useEffect, useCallback } from "react";

export interface PlayfieldProfile {
  name: string;
  image: string;
  camEnabled: boolean;
  micEnabled: boolean;
}

const STORAGE_KEY = "playfield-profile";

export function usePlayfieldProfile() {
  const [profile, setProfile] = useState<PlayfieldProfile | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      setProfile(JSON.parse(cached));
    }
  }, []);

  const saveProfile = useCallback((data: PlayfieldProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setProfile(data);
  }, []);

  return { profile, saveProfile };
}
