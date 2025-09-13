import { describe, it, expect, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../error-boundary";

// Mock the logger
jest.mock("../../errors/logger", () => ({
  logError: jest.fn(),
}));

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
}

// Custom fallback component
function CustomFallback({ error }: { error: Error }) {
  return <div>Custom error: {error.message}</div>;
}

describe("ErrorBoundary", () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it("should render children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });

  it("should render default error fallback when error occurs", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
  });

  it("should render custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom error: Test error")).toBeInTheDocument();
  });

  it("should reset error state when children change", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("No error")).toBeInTheDocument();
  });
});
