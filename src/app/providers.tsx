"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserContext } from "@/shared/hooks/use-user";
import { ErrorState, LoadingState } from "@/components/states";
import { useRouter } from "next/navigation";
import { useProfile, useAuth } from "@/shared/hooks";
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: (failureCount, error) => {
              // Don't retry on client errors (4xx)
              if (error && typeof error === "object" && "status" in error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const status = (error as any).status;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: (failureCount, error) => {
              // Don't retry mutations on client errors
              if (error && typeof error === "object" && "status" in error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const status = (error as any).status;
                if (status >= 400 && status < 500) {
                  return false;
                }
              }
              // Retry up to 2 times for server errors
              return failureCount < 2;
            },
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      {children}
    </QueryClientProvider>
  );
}

export function UserProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading: loadingAuth } = useAuth();
  const { profile, loading: loadingProfile } = useProfile(user?.id);

  if (loadingProfile || loadingAuth) {
    return <LoadingState />;
  }
  if (!user)
    return (
      <ErrorState
        message="You are not logged in at the moment. Please reauthenticate to continue."
        retryLabel="Log In"
        onRetry={() => router.replace("/auth/login")}
      />
    );
  if (!profile)
    return (
      <ErrorState
        title="Couldn't Find Profile"
        message="There doesn't seem to be a profile associated with your account. If you are an SI Leader click retry"
        retryLabel="Log In"
        onRetry={() => router.replace("/auth/login")}
      />
    );

  return (
    <UserContext.Provider value={{ user: { ...user, profile } }}>
      {children}
    </UserContext.Provider>
  );
}
