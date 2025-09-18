import { AppError } from "./types";

// Central error logging
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logError(error: AppError, context?: Record<string, any>) {
  const errorLog = {
    timestamp: error.timestamp,
    code: error.code,
    category: error.category,
    severity: error.severity,
    message: error.message,
    userMessage: error.userMessage,
    canRetry: error.canRetry,
    metadata: error.metadata,
    context,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "server",
    url: typeof window !== "undefined" ? window.location.href : "server",
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("App Error:", errorLog);
  }
  //Production logic will be under here
}
