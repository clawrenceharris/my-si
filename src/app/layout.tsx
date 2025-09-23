"use client";

import "./globals.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";

import {
  QueryProvider,
  SupabaseClientProvider,
  VideoClientProvider,
} from "@/providers";
import { ReactNode } from "react";
import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui";
import { Book, Clock, Menu, Rocket } from "lucide-react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en">
        <body>
          <header className="fixed top-0 bg-background/30 right-0 m-6 rounded-full backdrop-blur-lg flex justify-end items-center p-2 gap-4  z-99">
            <SignedIn>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="rounded-full text-muted-foreground bg-gray-200 shadow-sm shadow-foreground/20">
                      <Menu />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuLink href="/">
                        <span className="inline-flex items-center gap-3">
                          <Rocket className="inline" />
                          Home
                        </span>
                      </NavigationMenuLink>
                      <NavigationMenuLink href="/sessions">
                        <span className="inline-flex items-center gap-3">
                          <Clock className="inline" />
                          Sessions
                        </span>
                      </NavigationMenuLink>
                      <NavigationMenuLink href="/playbooks">
                        <span className="inline-flex items-center gap-3">
                          <Book className="inline" />
                          Library
                        </span>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <SignOutButton>
                          <Button variant={"tertiary"}>Sign Out</Button>
                        </SignOutButton>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </SignedIn>
            <SignedOut>
              <SignInButton>
                <Button variant={"tertiary"}>Sign In</Button>
              </SignInButton>
              <SignUpButton>
                <Button>Sign Up</Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn></SignedIn>
          </header>
          <QueryProvider>
            <SupabaseClientProvider>
              <VideoClientProvider>{children}</VideoClientProvider>
            </SupabaseClientProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
