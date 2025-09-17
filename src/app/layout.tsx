"use client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import {
  QueryProvider,
  SupabaseClientProvider,
  UserProvider,
} from "@/providers";
import { ReactNode } from "react";
import { Button } from "@/components";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <QueryProvider>
        <SupabaseClientProvider>
          <html lang="en">
            <body className="bg-gradient-to-br">
              <header className="flex justify-end items-center p-4 gap-4 h-16">
                <SignedOut>
                  <SignInButton>
                    <Button variant={"tertiary"}>Sign In</Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button>Sign Up</Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <SignOutButton>
                    <Button variant={"tertiary"}>Sign Out</Button>
                  </SignOutButton>
                </SignedIn>
              </header>
              {children}
            </body>
          </html>
        </SupabaseClientProvider>
      </QueryProvider>
    </ClerkProvider>
  );
}
