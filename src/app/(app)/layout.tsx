import { UserProvider } from "@/providers";
import React from "react";

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserProvider>{children}</UserProvider>;
}
