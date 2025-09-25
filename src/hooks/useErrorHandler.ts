import { AppError, ErrorSeverity } from "@/types/errors";
import { logError, normalizeError } from "@/utils/errorUtils";
import { useState, useCallback } from "react";

// Central error handling hook
export function useErrorHandler() {
  const [error, setError] = useState<AppError | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleError = useCallback((error: unknown) => {
    const normalizedError = normalizeError(error);
    setError(normalizedError);

    // Log error for monitoring
    logError(normalizedError);

    // Auto-clear non-critical errors
    if (normalizedError.severity === ErrorSeverity.LOW) {
      setTimeout(() => setError(null), 5000);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(
    async (retryFn: () => Promise<void>) => {
      if (!error?.canRetry) return;

      setIsRetrying(true);
      try {
        await retryFn();
        setError(null);
      } catch (retryError) {
        handleError(retryError);
      } finally {
        setIsRetrying(false);
      }
    },
    [error, handleError]
  );

  return {
    error,
    isRetrying,
    handleError,
    clearError,
    retry,
  };
}
