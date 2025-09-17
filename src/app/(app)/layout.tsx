import { UserProvider } from "@/providers";
import { ReactNode } from "react";

export default function AuthedLayout({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
