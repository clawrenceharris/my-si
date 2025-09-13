import { AppError } from "./types";

// Get current user ID (placeholder - implement based on your auth system)
function getCurrentUserId(): string | null {
  // This would typically come from your auth context
  return null;
}

// Send to monitoring service (placeholder)
function sendToMonitoringService(errorLog: any): void {
  // This would integrate with Sentry, LogRocket, or other monitoring service
  console.log("Would send to monitoring service:", errorLog);
}

// Centralized error logging
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
    userId: getCurrentUserId(),
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("App Error:", errorLog);
  }

  // Send to monitoring service in production
  if (process.env.NODE_ENV === "production") {
    sendToMonitoringService(errorLog);
  }
}
