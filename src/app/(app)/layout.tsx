"use client";
import { useAuth } from "@/shared/hooks/use-auth";
import "../globals.css";

import { QueryProvider, UserProvider } from "../providers";
import { useProfile } from "@/shared";
import { ErrorState } from "@/components/states";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <UserProvider>
        <div className="flex min-h-screen flex-col">
          {/* Page Content */}

          <main className="flex-1">{children}</main>
        </div>
      </UserProvider>
    </QueryProvider>
  );
}
