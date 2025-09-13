import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { useErrorHandler } from "../use-error-handler";
import {
  AppError,
  ErrorSeverity,
  ErrorCategory,
  AppErrorCode,
} from "../../errors/types";

// Mock the logger
jest.mock("../../errors/logger", () => ({
  logError: jest.fn(),
}));

describe("useErrorHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should initialize with no error", () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isRetrying).toBe(false);
  });

  it("should handle and normalize errors", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError("string error");
    });

    expect(result.current.error).toBeInstanceOf(AppError);
    expect(result.current.error?.code).toBe(AppErrorCode.UNKNOWN_ERROR);
  });

  it("should clear errors", () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError("test error");
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it("should auto-clear low severity errors after 5 seconds", () => {
    const { result } = renderHook(() => useErrorHandler());

    const lowSeverityError = new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.LOW,
      "Low severity error"
    );

    act(() => {
      result.current.handleError(lowSeverityError);
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.error).toBeNull();
  });

  it("should not auto-clear high severity errors", () => {
    const { result } = renderHook(() => useErrorHandler());

    const highSeverityError = new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.HIGH,
      "High severity error"
    );

    act(() => {
      result.current.handleError(highSeverityError);
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(result.current.error).not.toBeNull();
  });

  it("should handle retry for retryable errors", async () => {
    const { result } = renderHook(() => useErrorHandler());

    const retryableError = new AppError(
      AppErrorCode.NETWORK_SERVER_ERROR,
      ErrorCategory.NETWORK,
      ErrorSeverity.HIGH,
      "Network error",
      true
    );

    const mockRetryFn = jest.fn().mockResolvedValue(undefined);

    act(() => {
      result.current.handleError(retryableError);
    });

    expect(result.current.error).not.toBeNull();

    await act(async () => {
      await result.current.retry(mockRetryFn);
    });

    expect(mockRetryFn).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.isRetrying).toBe(false);
  });

  it("should not retry non-retryable errors", async () => {
    const { result } = renderHook(() => useErrorHandler());

    const nonRetryableError = new AppError(
      AppErrorCode.AUTH_INVALID_CREDENTIALS,
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.HIGH,
      "Auth error",
      false
    );

    const mockRetryFn = jest.fn();

    act(() => {
      result.current.handleError(nonRetryableError);
    });

    await act(async () => {
      await result.current.retry(mockRetryFn);
    });

    expect(mockRetryFn).not.toHaveBeenCalled();
  });

  it("should handle retry failure", async () => {
    const { result } = renderHook(() => useErrorHandler());

    const retryableError = new AppError(
      AppErrorCode.NETWORK_SERVER_ERROR,
      ErrorCategory.NETWORK,
      ErrorSeverity.HIGH,
      "Network error",
      true
    );

    const retryError = new Error("Retry failed");
    const mockRetryFn = jest.fn().mockRejectedValue(retryError);

    act(() => {
      result.current.handleError(retryableError);
    });

    await act(async () => {
      await result.current.retry(mockRetryFn);
    });

    expect(result.current.error).toBeInstanceOf(AppError);
    expect(result.current.isRetrying).toBe(false);
  });
});
