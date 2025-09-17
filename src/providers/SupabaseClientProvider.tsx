"use client";

import createClerkSupabaseClient from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { SupabaseClient } from "@supabase/supabase-js";
import React, { createContext, useContext, useMemo } from "react";

const SupabaseContext = createContext<SupabaseClient | null>(null);

export function SupabaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    return createClerkSupabaseClient({
      getTokenFn: getToken,
    });
  }, [getToken]);

  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabaseClient() {
  const ctx = useContext(SupabaseContext);
  if (!ctx) throw new Error("useSupabase must be used inside SupabaseProvider");
  return ctx;
}
