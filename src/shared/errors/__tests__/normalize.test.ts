import { describe, it, expect } from "@jest/globals";
import { normalizeError } from "../normalize";
import {
  AppError,
  AuthenticationError,
  NetworkError,
  AppErrorCode,
  ErrorCategory,
  ErrorSeverity,
} from "../types";

describe("normalizeError", () => {
  it("should return AppError as-is if already normalized", () => {
    const originalError = new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      "Test error"
    );

    const result = normalizeError(originalError);
    expect(result).toBe(originalError);
  });

  it("should normalize Supabase invalid credentials error", () => {
    const supabaseError = {
      message: "Invalid login credentials",
    };

    const result = normalizeError(supabaseError);
    expect(result).toBeInstanceOf(AuthenticationError);
    expect(result.code).toBe(AppErrorCode.AUTH_INVALID_CREDENTIALS);
    expect(result.userMessage).toBe(
      "Invalid email or password. Please try again."
    );
  });

  it("should normalize Supabase email not confirmed error", () => {
    const supabaseError = {
      message: "Email not confirmed",
    };

    const result = normalizeError(supabaseError);
    expect(result).toBeInstanceOf(AuthenticationError);
    expect(result.code).toBe(AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED);
  });

  it("should normalize Supabase user already registered error", () => {
    const supabaseError = {
      message: "User already registered",
    };

    const result = normalizeError(supabaseError);
    expect(result).toBeInstanceOf(AuthenticationError);
    expect(result.code).toBe(AppErrorCode.AUTH_EMAIL_ALREADY_EXISTS);
  });

  it("should normalize server errors (status >= 500)", () => {
    const serverError = {
      message: "Internal server error",
      status: 500,
    };

    const result = normalizeError(serverError);
    expect(result).toBeInstanceOf(NetworkError);
    expect(result.code).toBe(AppErrorCode.NETWORK_SERVER_ERROR);
    expect(result.canRetry).toBe(true);
  });

  it("should normalize fetch/network errors", () => {
    const fetchError = new TypeError("fetch failed");

    const result = normalizeError(fetchError);
    expect(result).toBeInstanceOf(NetworkError);
    expect(result.code).toBe(AppErrorCode.NETWORK_OFFLINE);
    expect(result.canRetry).toBe(true);
  });

  it("should normalize generic JavaScript errors", () => {
    const jsError = new Error("Something went wrong");

    const result = normalizeError(jsError);
    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe(AppErrorCode.UNKNOWN_ERROR);
    expect(result.canRetry).toBe(true);
    expect(result.metadata?.originalMessage).toBe("Something went wrong");
  });

  it("should normalize unknown error types", () => {
    const unknownError = "string error";

    const result = normalizeError(unknownError);
    expect(result).toBeInstanceOf(AppError);
    expect(result.code).toBe(AppErrorCode.UNKNOWN_ERROR);
    expect(result.metadata?.originalError).toBe("string error");
  });
});
