import { User } from "@/types";
import { createContext, useContext } from "react";

export const UserContext = createContext<
  | {
      user: User;
    }
  | undefined
>(undefined);
export function useUser() {
  const context = useContext(UserContext);
  if (!context)
    throw new Error("UserContext not set. Use inside (authed) layout.");
  return context;
}
