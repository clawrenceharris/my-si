"use client";

import "./globals.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { QueryProvider, VideoClientProvider } from "@/providers";
import { ReactNode } from "react";
import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Toaster,
} from "@/components/ui";
import { Book, Clock, Menu, Notebook, Rocket } from "lucide-react";
import { SignedIn, SignedOut } from "@/features/auth/components";
import { useAuth } from "@/features/auth/hooks";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { signOut } = useAuth();
  return (
    <html lang="en">
      <body>
        <header className="fixed top-0 px-3 py-4 md:p-6 justify-between items-center flex w-full z-99">
          <h1 className="backdrop-blur-lg bg-background/30 rounded-full py-1 px-4 text-xl font-bold items-center flex gap-1 text-background">
            <Notebook className="inline" /> MySI Playbook
          </h1>
          <nav className="flex p-2 rounded-full backdrop-blur-lg bg-background/30 gap-1.5 md:gap-3 justify-end items-center">
            <SignedIn>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="rounded-full shadow-sm shadow-foreground/20">
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
                          Playbooks
                        </span>
                      </NavigationMenuLink>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </SignedIn>
            <SignedIn>
              <Button onClick={signOut} variant={"tertiary"}>
                Sign Out
              </Button>
            </SignedIn>
            <SignedOut>
              <Button variant={"tertiary"}>Sign In</Button>
              <Button>Sign Up</Button>
            </SignedOut>
          </nav>
        </header>
        <QueryProvider>
          <VideoClientProvider>{children}</VideoClientProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
