import { describe, it, expect, jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useAsyncOperation } from "../../hooks/use-async-operation";
import { ErrorDisplay } from "../error-display";

// Example component using the error handling system
function ExampleComponent() {
  const mockOperation = async (shouldFail: boolean) => {
    if (shouldFail) {
      throw new Error("Operation failed");
    }
    return "Success";
  };

  const { execute, loading, error, retry, clearError } =
    useAsyncOperation(mockOperation);

  return (
    <div>
      <button onClick={() => execute(true)} disabled={loading}>
        {loading ? "Loading..." : "Trigger Error"}
      </button>

      <button onClick={() => execute(false)} disabled={loading}>
        {loading ? "Loading..." : "Trigger Success"}
      </button>

      <ErrorDisplay
        error={error}
        onRetry={() => retry(() => mockOperation(false))}
        onDismiss={clearError}
      />
    </div>
  );
}

describe("Error Handling System Integration", () => {
  it("should handle error flow correctly", async () => {
    render(<ExampleComponent />);

    // Trigger an error
    fireEvent.click(screen.getByText("Trigger Error"));

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    // Should show error message
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument();

    // Should show retry button
    expect(screen.getByText("Try Again")).toBeInTheDocument();

    // Click retry
    fireEvent.click(screen.getByText("Try Again"));

    // Error should be cleared after successful retry
    await waitFor(() => {
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
  });

  it("should handle success flow correctly", async () => {
    render(<ExampleComponent />);

    // Trigger success
    fireEvent.click(screen.getByText("Trigger Success"));

    // Should show loading state
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Should not show any error
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("should allow dismissing errors", async () => {
    render(<ExampleComponent />);

    // Trigger an error
    fireEvent.click(screen.getByText("Trigger Error"));

    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    // Click dismiss
    fireEvent.click(screen.getByText("Dismiss"));

    // Error should be cleared
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
