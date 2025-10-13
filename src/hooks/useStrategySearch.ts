import { useStrategies } from "@/features/strategies/hooks";
import { Strategies } from "@/types/tables";
import { getUserErrorMessage } from "@/utils/error";
import { useState, useEffect, useCallback } from "react";

export interface UseMediaSearchResult {
  results: Strategies[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  search: (query: string) => void;
  clearResults: () => void;
  retry: () => void;
}

/**
 * Hook for strategy search
 */
export function useStrategySearch(): UseMediaSearchResult {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Strategies[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { strategies = [] } = useStrategies();

  const performSearch = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm || searchTerm.length < 3) {
        setResults([]);
        setError(null);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const searchResults = strategies.filter((s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(searchResults);
        setHasSearched(true);
      } catch (error) {
        setError(getUserErrorMessage(error));
        setResults([]);
        setHasSearched(true);
      } finally {
        setIsLoading(false);
      }
    },
    [strategies]
  );

  // Trigger search when debounced term changes
  useEffect(() => {
    performSearch(query);
  }, [performSearch, query]);

  const search = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const clearResults = useCallback(() => {
    setQuery("");
    setResults([]);
    setError(null);
    setHasSearched(false);
  }, []);

  const retry = useCallback(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  return {
    results,
    isLoading,
    error,
    hasSearched,
    search,
    clearResults,
    retry,
  };
}
