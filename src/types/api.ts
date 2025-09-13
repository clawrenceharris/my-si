// Generic API response types
export type ApiResponse<T = any> = {
  data: T;
  success: boolean;
  message?: string;
};

export type ApiError = {
  error: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

// Supabase specific response types
export type SupabaseResponse<T> = {
  data: T | null;
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  } | null;
};

export type SupabaseQueryResponse<T> = {
  data: T[] | null;
  error: {
    message: string;
    details: string;
    hint: string;
    code: string;
  } | null;
  count: number | null;
};
