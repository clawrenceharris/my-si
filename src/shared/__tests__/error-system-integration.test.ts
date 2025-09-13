import { describe, it, expect } from "@jest/globals";
import {
  normalizeError,
  AppError,
  AuthenticationError,
  NetworkError,
  AppErrorCode,
  ErrorCategory,
  ErrorSeverity,
  ERROR_MESSAGES,
} from "../errors";

describe("Error System Integration", () => {
  it("should provide complete error handling workflow", () => {
    // 1. Create various error types
    const authError = new AuthenticationError(
      AppErrorCode.AUTH_INVALID_CREDENTIALS,
      ERROR_MESSAGES[AppErrorCode.AUTH_INVALID_CREDENTIALS]
    );

    const networkError = new NetworkError(
      ERROR_MESSAGES[AppErrorCode.NETWORK_SERVER_ERROR],
      true
    );

    // 2. Verify error properties
    expect(authError.code).toBe(AppErrorCode.AUTH_INVALID_CREDENTIALS);
    expect(authError.category).toBe(ErrorCategory.AUTHENTICATION);
    expect(authError.severity).toBe(ErrorSeverity.HIGH);
    expect(authError.canRetry).toBe(false);

    expect(networkError.canRetry).toBe(true);
    expect(networkError.category).toBe(ErrorCategory.NETWORK);

    // 3. Test normalization
    const supabaseError = { message: "Invalid login credentials" };
    const normalizedError = normalizeError(supabaseError);

    expect(normalizedError).toBeInstanceOf(AuthenticationError);
    expect(normalizedError.code).toBe(AppErrorCode.AUTH_INVALID_CREDENTIALS);
    expect(normalizedError.userMessage).toBe(
      ERROR_MESSAGES[AppErrorCode.AUTH_INVALID_CREDENTIALS]
    );

    // 4. Test that already normalized errors pass through
    const alreadyNormalized = normalizeError(authError);
    expect(alreadyNormalized).toBe(authError);

    // 5. Test unknown error normalization
    const unknownError = normalizeError("string error");
    expect(unknownError).toBeInstanceOf(AppError);
    expect(unknownError.code).toBe(AppErrorCode.UNKNOWN_ERROR);
    expect(unknownError.metadata?.originalError).toBe("string error");
  });

  it("should have consistent error messages for all codes", () => {
    const allCodes = Object.values(AppErrorCode);

    allCodes.forEach((code) => {
      expect(ERROR_MESSAGES[code]).toBeDefined();
      expect(typeof ERROR_MESSAGES[code]).toBe("string");
      expect(ERROR_MESSAGES[code].length).toBeGreaterThan(0);
    });
  });

  it("should properly categorize errors by severity", () => {
    // Authentication errors should be HIGH severity
    const authError = new AuthenticationError(
      AppErrorCode.AUTH_INVALID_CREDENTIALS,
      "test"
    );
    expect(authError.severity).toBe(ErrorSeverity.HIGH);

    // Network errors should be HIGH severity
    const networkError = new NetworkError("test");
    expect(networkError.severity).toBe(ErrorSeverity.HIGH);

    // Validation errors should be MEDIUM severity
    const validationError = normalizeError(new Error("validation failed"));
    expect(validationError.severity).toBe(ErrorSeverity.MEDIUM);
  });

  it("should handle retry logic correctly", () => {
    // Network errors should be retryable by default
    const networkError = new NetworkError("Network failed");
    expect(networkError.canRetry).toBe(true);

    // Auth errors should not be retryable
    const authError = new AuthenticationError(
      AppErrorCode.AUTH_INVALID_CREDENTIALS,
      "Invalid credentials"
    );
    expect(authError.canRetry).toBe(false);

    // Network errors can be made non-retryable
    const nonRetryableNetwork = new NetworkError("Network failed", false);
    expect(nonRetryableNetwork.canRetry).toBe(false);
  });
});
