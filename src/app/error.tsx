"use client";

import { ErrorState } from "@/components/states";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <main>
      <ErrorState variant="card" onRetry={router.refresh} />
    </main>
  );
}
