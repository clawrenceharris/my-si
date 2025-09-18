"use client";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import "./globals.css";
import { QueryProvider, SupabaseClientProvider } from "@/providers";
import { ReactNode } from "react";
import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  SidebarProvider,
} from "@/components/ui";
import { VideoClientProvider } from "@/providers";
import { Book, Clock, Hamburger, Link, Menu, Rocket } from "lucide-react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <html lang="en">
        <body className="bg-gradient-to-br">
          <header className="sticky top-0 flex justify-end items-center p-4 gap-4 h-16 z-99">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>
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
                    <NavigationMenuLink href="/library">
                      <span className="inline-flex items-center gap-3">
                        <Book className="inline" />
                        Library
                      </span>
                    </NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
          <QueryProvider>
            <SupabaseClientProvider>
              {/* <VideoClientProvider> */}
              <main>{children}</main>
              {/* </VideoClientProvider> */}
            </SupabaseClientProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
