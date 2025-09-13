import { describe, it, expect, jest } from "@jest/globals";
import { renderHook, act } from "@testing-library/react";
import { useAsyncOperation } from "../use-async-operation";

describe("useAsyncOperation", () => {
  it("should initialize with correct default state", () => {
    const mockOperation = jest.fn();
    const { result } = renderHook(() => useAsyncOperation(mockOperation));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle successful operation", async () => {
    const mockOperation = jest.fn().mockResolvedValue("success");
    const { result } = renderHook(() => useAsyncOperation(mockOperation));

    let operationResult: any;

    await act(async () => {
      operationResult = await result.current.execute("arg1", "arg2");
    });

    expect(mockOperation).toHaveBeenCalledWith("arg1", "arg2");
    expect(operationResult).toBe("success");
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should handle operation failure", async () => {
    const mockError = new Error("Operation failed");
    const mockOperation = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useAsyncOperation(mockOperation));

    let operationResult: any;

    await act(async () => {
      operationResult = await result.current.execute();
    });

    expect(operationResult).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).not.toBeNull();
  });

  it("should set loading state during operation", async () => {
    let resolveOperation: (value: string) => void;
    const mockOperation = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveOperation = resolve;
        })
    );

    const { result } = renderHook(() => useAsyncOperation(mockOperation));

    act(() => {
      result.current.execute();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveOperation!("success");
    });

    expect(result.current.loading).toBe(false);
  });

  it("should clear error before new operation", async () => {
    const mockOperation = jest
      .fn()
      .mockRejectedValueOnce(new Error("First error"))
      .mockResolvedValueOnce("success");

    const { result } = renderHook(() => useAsyncOperation(mockOperation));

    // First operation fails
    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).not.toBeNull();

    // Second operation succeeds
    await act(async () => {
      await result.current.execute();
    });

    expect(result.current.error).toBeNull();
  });

  it("should provide clearError function", () => {
    const mockOperation = jest.fn();
    const { result } = renderHook(() => useAsyncOperation(mockOperation));

    act(() => {
      result.current.handleError(new Error("Test error"));
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
