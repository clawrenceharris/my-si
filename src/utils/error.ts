import {
  AppError,
  AppErrorCode,
  AuthenticationError,
  ErrorCategory,
  ErrorSeverity,
  NetworkError,
} from "@/types/errors";

// Centralized error message mapping
export const ERROR_MESSAGES: Record<AppErrorCode, string> = {
  // Authentication
  [AppErrorCode.AUTH_INVALID_CREDENTIALS]:
    "Invalid email or password. Please try again.",
  [AppErrorCode.AUTH_USER_NOT_FOUND]:
    "No account found with this email address.",
  [AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED]:
    "Please check your email and click the confirmation link.",
  [AppErrorCode.AUTH_PASSWORD_TOO_WEAK]:
    "Password must be at least 8 characters with numbers and symbols.",
  [AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS]:
    "An account with this email already exists.",
  [AppErrorCode.AUTH_SESSION_EXPIRED]:
    "Your session has expired. Please sign in again.",
  [AppErrorCode.AUTH_RATE_LIMITED]:
    "Too many attempts. Please wait a few minutes before trying again.",

  // Sessions
  [AppErrorCode.SESSION_NOT_FOUND]:
    "Session not found. It may have been deleted or expired.",
  [AppErrorCode.SESSION_ALREADY_STARTED]: "This session has already started.",
  [AppErrorCode.SESSION_CAPACITY_FULL]: "This session is at full capacity.",
  [AppErrorCode.SESSION_ACCESS_DENIED]:
    "You don't have permission to access this session.",

  // Check-in
  [AppErrorCode.CHECKIN_ALREADY_CHECKED_IN]:
    "You're already checked in to this session.",
  [AppErrorCode.CHECKIN_SESSION_NOT_ACTIVE]:
    "This session is not currently active for check-ins.",
  [AppErrorCode.CHECKIN_INVALID_CODE]:
    "Invalid session code. Please check the code and try again.",

  // Network
  [AppErrorCode.NETWORK_OFFLINE]:
    "You appear to be offline. Please check your connection.",
  [AppErrorCode.NETWORK_TIMEOUT]: "Request timed out. Please try again.",
  [AppErrorCode.NETWORK_SERVER_ERROR]:
    "Server error. Please try again in a moment.",

  // Validation
  [AppErrorCode.VALIDATION_REQUIRED_FIELD]: "This field is required.",
  [AppErrorCode.VALIDATION_INVALID_EMAIL]:
    "Please enter a valid email address.",
  [AppErrorCode.VALIDATION_INVALID_FORMAT]:
    "Invalid format. Please check your input.",

  // Generic
  [AppErrorCode.UNKNOWN_ERROR]: "Something went wrong. Please try again.",
  [AppErrorCode.PERMISSION_DENIED]:
    "You don't have permission to perform this action.",
  [AppErrorCode.RESOURCE_NOT_FOUND]: "The requested resource was not found.",
};

export function getUserErrorMessage(error: unknown): string {
  return normalizeError(error).message;
}

// Central error normalization function
export function normalizeError(error: unknown): AppError {
  // Already normalized
  if (error instanceof AppError) {
    return error;
  }

  // Supabase auth errors
  if (error && typeof error === "object" && "message" in error) {
    const supabaseError = error as { message: string; status?: number };

    // Map common Supabase errors to our error codes
    if (supabaseError.message.includes("Invalid login credentials")) {
      return new AuthenticationError(
        AppErrorCode.AUTH_INVALID_CREDENTIALS,
        ERROR_MESSAGES[AppErrorCode.AUTH_INVALID_CREDENTIALS]
      );
    }

    if (supabaseError.message.includes("Email not confirmed")) {
      return new AuthenticationError(
        AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED,
        ERROR_MESSAGES[AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED]
      );
    }

    if (supabaseError.message.includes("User already registered")) {
      return new AuthenticationError(
        AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS,
        ERROR_MESSAGES[AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS]
      );
    }

    // Network errors
    if (supabaseError.status && supabaseError.status >= 500) {
      return new NetworkError(
        ERROR_MESSAGES[AppErrorCode.NETWORK_SERVER_ERROR],
        true
      );
    }
  }

  // Network/fetch errors
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return new NetworkError(ERROR_MESSAGES[AppErrorCode.NETWORK_OFFLINE], true);
  }

  // Generic JavaScript errors
  if (error instanceof Error) {
    return new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      ERROR_MESSAGES[AppErrorCode.UNKNOWN_ERROR],
      true,
      { originalMessage: error.message }
    );
  }

  // Fallback for unknown error types
  return new AppError(
    AppErrorCode.UNKNOWN_ERROR,
    ErrorCategory.SYSTEM,
    ErrorSeverity.MEDIUM,
    ERROR_MESSAGES[AppErrorCode.UNKNOWN_ERROR],
    true,
    { originalError: String(error) }
  );
}

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
