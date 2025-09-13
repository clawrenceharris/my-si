import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorDisplay } from "../error-display";
import {
  AppError,
  AppErrorCode,
  ErrorCategory,
  ErrorSeverity,
} from "../../errors/types";

describe("ErrorDisplay", () => {
  it("should render nothing when no error", () => {
    const { container } = render(<ErrorDisplay error={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render error message", () => {
    const error = new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      "Test error message"
    );

    render(<ErrorDisplay error={error} />);
    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("should render retry button for retryable errors", () => {
    const error = new AppError(
      AppErrorCode.NETWORK_SERVER_ERROR,
      ErrorCategory.NETWORK,
      ErrorSeverity.HIGH,
      "Network error",
      true // canRetry
    );

    const onRetry = jest.fn();
    render(<ErrorDisplay error={error} onRetry={onRetry} />);

    const retryButton = screen.getByText("Try Again");
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalled();
  });

  it("should not render retry button for non-retryable errors", () => {
    const error = new AppError(
      AppErrorCode.AUTH_INVALID_CREDENTIALS,
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.HIGH,
      "Auth error",
      false // canRetry
    );

    render(<ErrorDisplay error={error} onRetry={jest.fn()} />);
    expect(screen.queryByText("Try Again")).not.toBeInTheDocument();
  });

  it("should render dismiss button when onDismiss provided", () => {
    const error = new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      "Test error"
    );

    const onDismiss = jest.fn();
    render(<ErrorDisplay error={error} onDismiss={onDismiss} />);

    const dismissButton = screen.getByText("Dismiss");
    expect(dismissButton).toBeInTheDocument();

    fireEvent.click(dismissButton);
    expect(onDismiss).toHaveBeenCalled();
  });

  it("should render field information when available", () => {
    const error = new AppError(
      AppErrorCode.VALIDATION_INVALID_FORMAT,
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      "Invalid input",
      false,
      { field: "email" }
    );

    render(<ErrorDisplay error={error} />);
    expect(screen.getByText("Field: email")).toBeInTheDocument();
  });

  it("should apply custom className", () => {
    const error = new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      "Test error"
    );

    const { container } = render(
      <ErrorDisplay error={error} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("should have proper accessibility attributes", () => {
    const error = new AppError(
      AppErrorCode.UNKNOWN_ERROR,
      ErrorCategory.SYSTEM,
      ErrorSeverity.MEDIUM,
      "Test error"
    );

    render(<ErrorDisplay error={error} />);
    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
  });
});
