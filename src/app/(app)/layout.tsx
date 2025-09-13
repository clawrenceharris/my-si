"use client";
import { useAuth } from "@/shared/hooks/use-auth";
import "../globals.css";

import { QueryProvider, UserProvider } from "../providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <QueryProvider>
      <UserProvider user={user}>
        <div className="flex min-h-screen flex-col">
          {/* Page Content */}

          <main className="flex-1">{children}</main>
        </div>
      </UserProvider>
    </QueryProvider>
  );
}
