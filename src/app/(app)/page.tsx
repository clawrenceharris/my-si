"use client";
import { useUser } from "@/shared/hooks";

export default function Home() {
  const { user } = useUser();

  return (
    <div>
      <h1>Welcome, {user.profile.full_name}</h1>
    </div>
  );
}
