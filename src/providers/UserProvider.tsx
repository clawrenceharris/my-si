"use client";

import { ErrorState, LoadingState } from "@/components/states";
import { useProfile } from "@/shared";
import { UserResource } from "@clerk/types";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { createContext, ReactNode, useContext } from "react";
import { Profiles } from "@/types/tables";
import { useRouter } from "next/navigation";

export function UserProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded: loadedUser } = useClerkUser();
  const { profile, loading: loadingProfile } = useProfile(user?.id);
  const router = useRouter();
  if (!loadedUser || loadingProfile) {
    return <LoadingState />;
  }
  if (!user)
    return (
      <ErrorState
        message="You are not logged in at the moment. Please reauthenticate to continue."
        onRetry={() => router.replace("/signup")}
      />
    );
  if (!profile)
    return (
      <ErrorState
        title="Couldn't find your profile"
        message="There doesn't seem to be a profile associated with your account. If you are an SI Leader click retry"
        retryLabel="Log In"
        onRetry={() => router.replace("/")}
      />
    );

  return (
    <UserContext.Provider value={{ user, profile }}>
      {children}
    </UserContext.Provider>
  );
}

export const UserContext = createContext<
  | {
      user: UserResource;
      profile: Profiles;
    }
  | undefined
>(undefined);
export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("UserContext not set. Use inside (authed) layout.");
  return context;
}
