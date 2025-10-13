import { useAuth } from "../hooks";

export default function SignedIn({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return children;
}
