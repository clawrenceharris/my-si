import { useState, useCallback } from "react";
import { useErrorHandler } from "./use-error-handler";

// Hook for handling async operations with built-in error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAsyncOperation<T extends any[], R>(
  operation: (...args: T) => Promise<R>
) {
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError, retry } = useErrorHandler();

  const execute = useCallback(
    async (...args: T): Promise<R | null> => {
      setLoading(true);
      clearError();

      try {
        const result = await operation(...args);
        return result;
      } catch (error) {
        handleError(error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [operation, handleError, clearError]
  );

  return {
    execute,
    loading,
    error,
    retry,
    clearError,
    handleError,
  };
}
