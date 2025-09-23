"use client";
import React from "react";
import { createContext, useContext } from "react";

import { ErrorState, LoadingState } from "@/components/states";
import { UserResource } from "@clerk/types";
import { useUser as useClerkUser } from "@clerk/nextjs";
import { Profiles } from "@/types/tables";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded: loadedUser } = useClerkUser();
  const { profile, loading: loadingProfile } = useProfile(user?.id);
  const router = useRouter();
  if (!loadedUser || loadingProfile) {
    return <LoadingState />;
  }
  if (!user) {
    return (
      <ErrorState
        title="Not signed in."
        message="Please log in to see this page."
        retryLabel="Sign in"
        onRetry={() => router.replace("auth/login")}
      />
    );
  }
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
export type AppUser = { user: UserResource; profile: Profiles };

export const UserContext = createContext<AppUser | undefined>(undefined);
export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("UserContext not set. Use inside (authed) layout.");
  return context;
}
