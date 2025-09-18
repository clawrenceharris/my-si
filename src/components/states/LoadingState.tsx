import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="h-screen text-primary-300 flex items-center justify-center">
      <Loader2 size={80} className="animate-spin" />
    </div>
  );
}
