import {
  AppError,
  AuthenticationError,
  NetworkError,
  AppErrorCode,
  ErrorCategory,
  ErrorSeverity,
} from "./types";
import { ERROR_MESSAGES } from "./codes";

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
