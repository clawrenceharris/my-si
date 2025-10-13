import { ReactNode } from "react";
import { useAuth } from "../hooks";

export default function SignedOut({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return null;

  return children;
}
