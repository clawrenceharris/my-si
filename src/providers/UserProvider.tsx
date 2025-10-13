"use client";
import React from "react";
import { createContext, useContext } from "react";

import { ErrorState, LoadingState } from "@/components/states";
import { Profiles } from "@/types/tables";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks";
import { useAuth } from "@/features/auth/hooks";
import { User } from "@supabase/supabase-js";

function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: loadingUser } = useAuth();
  const { profile, loading: loadingProfile } = useProfile(user?.id);
  const router = useRouter();
  if (loadingUser || loadingProfile) {
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
export type AppUser = { user: User; profile: Profiles };

const UserContext = createContext<AppUser | undefined>(undefined);
function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("UserContext not set. Use inside (authed) layout.");
  return context;
}

export { UserProvider, useUser };
