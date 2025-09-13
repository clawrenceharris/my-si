import { describe, it, expect } from "@jest/globals";
import {
  AppError,
  ValidationError,
  NetworkError,
  AuthenticationError,
  ErrorSeverity,
  ErrorCategory,
  AppErrorCode,
} from "../types";

describe("Error Types", () => {
  describe("AppError", () => {
    it("should create an AppError with all properties", () => {
      const error = new AppError(
        AppErrorCode.UNKNOWN_ERROR,
        ErrorCategory.SYSTEM,
        ErrorSeverity.MEDIUM,
        "Test error message",
        true,
        { test: "metadata" }
      );

      expect(error.code).toBe(AppErrorCode.UNKNOWN_ERROR);
      expect(error.category).toBe(ErrorCategory.SYSTEM);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.userMessage).toBe("Test error message");
      expect(error.canRetry).toBe(true);
      expect(error.metadata).toEqual({ test: "metadata" });
      expect(error.timestamp).toBeInstanceOf(Date);
      expect(error.name).toBe("AppError");
    });

    it("should have default values for optional parameters", () => {
      const error = new AppError(
        AppErrorCode.UNKNOWN_ERROR,
        ErrorCategory.SYSTEM,
        ErrorSeverity.MEDIUM,
        "Test error message"
      );

      expect(error.canRetry).toBe(false);
      expect(error.metadata).toBeUndefined();
    });
  });

  describe("ValidationError", () => {
    it("should create a ValidationError with correct defaults", () => {
      const error = new ValidationError("Invalid input", "email");

      expect(error.code).toBe(AppErrorCode.VALIDATION_INVALID_FORMAT);
      expect(error.category).toBe(ErrorCategory.VALIDATION);
      expect(error.severity).toBe(ErrorSeverity.MEDIUM);
      expect(error.userMessage).toBe("Invalid input");
      expect(error.canRetry).toBe(false);
      expect(error.metadata).toEqual({ field: "email" });
      expect(error.name).toBe("ValidationError");
    });
  });

  describe("NetworkError", () => {
    it("should create a NetworkError with retry capability by default", () => {
      const error = new NetworkError("Network failed");

      expect(error.code).toBe(AppErrorCode.NETWORK_SERVER_ERROR);
      expect(error.category).toBe(ErrorCategory.NETWORK);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.canRetry).toBe(true);
      expect(error.name).toBe("NetworkError");
    });

    it("should allow disabling retry capability", () => {
      const error = new NetworkError("Network failed", false);

      expect(error.canRetry).toBe(false);
    });
  });

  describe("AuthenticationError", () => {
    it("should create an AuthenticationError with correct defaults", () => {
      const error = new AuthenticationError(
        AppErrorCode.AUTH_INVALID_CREDENTIALS,
        "Invalid credentials"
      );

      expect(error.code).toBe(AppErrorCode.AUTH_INVALID_CREDENTIALS);
      expect(error.category).toBe(ErrorCategory.AUTHENTICATION);
      expect(error.severity).toBe(ErrorSeverity.HIGH);
      expect(error.canRetry).toBe(false);
      expect(error.name).toBe("AuthenticationError");
    });
  });
});
