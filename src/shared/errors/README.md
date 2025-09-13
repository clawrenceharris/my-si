# Error Handling System

A comprehensive, centralized error handling system for MySI that provides consistent user experiences, automatic retry capabilities, and comprehensive error tracking.

## Quick Start

### 1. Basic Error Handling in Components

```tsx
import { useAsyncOperation } from "@/shared/hooks";
import { ErrorDisplay } from "@/shared/components";

function MyComponent() {
  const {
    execute: login,
    loading,
    error,
    retry,
  } = useAsyncOperation(authService.login);

  const handleSubmit = async (data: LoginData) => {
    const result = await login(data);
    if (result) {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorDisplay error={error} onRetry={retry} />
      {/* Form fields */}
      <Button type="submit" loading={loading}>
        Sign In
      </Button>
    </form>
  );
}
```

### 2. Service Methods with Error Handling

```tsx
import {
  normalizeError,
  AuthenticationError,
  AppErrorCode,
  ERROR_MESSAGES,
} from "@/shared/errors";

export const authService = {
  async login(data: LoginData): Promise<User> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword(
        data
      );

      if (error) {
        throw error; // Will be normalized automatically
      }

      if (!authData.user) {
        throw new AuthenticationError(
          AppErrorCode.AUTH_USER_NOT_FOUND,
          ERROR_MESSAGES[AppErrorCode.AUTH_USER_NOT_FOUND]
        );
      }

      return authData.user;
    } catch (error) {
      throw normalizeError(error);
    }
  },
};
```

### 3. Global Error Boundary

```tsx
import { ErrorBoundary } from "@/shared/components";

function App({ children }: { children: ReactNode }) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}
```

## Core Concepts

### Error Classification

All errors are classified by:

- **Code**: Specific error identifier (e.g., `AUTH_INVALID_CREDENTIALS`)
- **Category**: Broad error type (e.g., `AUTHENTICATION`, `NETWORK`)
- **Severity**: Impact level (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`)
- **Retry Capability**: Whether the operation can be retried

### Error Normalization

The `normalizeError()` function converts any error into a standardized `AppError`:

```tsx
// Supabase errors
normalizeError({ message: "Invalid login credentials" });
// → AuthenticationError with user-friendly message

// Network errors
normalizeError(new TypeError("fetch failed"));
// → NetworkError with retry capability

// Unknown errors
normalizeError("something went wrong");
// → AppError with generic message
```

### User-Friendly Messages

All error codes map to clear, actionable messages:

```tsx
AUTH_INVALID_CREDENTIALS → "Invalid email or password. Please try again."
NETWORK_OFFLINE → "You appear to be offline. Please check your connection."
SESSION_NOT_FOUND → "Session not found. It may have been deleted or expired."
```

## Available Hooks

### `useErrorHandler()`

Core error handling hook:

```tsx
const { error, isRetrying, handleError, clearError, retry } = useErrorHandler();

// Handle any error
handleError(someError);

// Clear current error
clearError();

// Retry with custom function
await retry(async () => {
  await someOperation();
});
```

### `useAsyncOperation(operation)`

Wraps async operations with automatic error handling:

```tsx
const { execute, loading, error, retry, clearError } =
  useAsyncOperation(myAsyncFunction);

// Execute with automatic error handling
const result = await execute(arg1, arg2);

// Retry the last operation
await retry();
```

## UI Components

### `<ErrorDisplay />`

Displays errors with optional retry and dismiss actions:

```tsx
<ErrorDisplay
  error={error}
  onRetry={() => retry()}
  onDismiss={() => clearError()}
  className="mb-4"
/>
```

### `<ErrorBoundary />`

Catches React errors and displays fallback UI:

```tsx
<ErrorBoundary fallback={CustomErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

## Error Types

### `AppError`

Base error class with all standard properties.

### `AuthenticationError`

For authentication-related errors (login, signup, etc.).

### `NetworkError`

For network and connectivity issues.

### `ValidationError`

For input validation failures.

## Best Practices

### 1. Always Use Error Normalization

```tsx
// ✅ Good
try {
  await someOperation();
} catch (error) {
  throw normalizeError(error);
}

// ❌ Bad
try {
  await someOperation();
} catch (error) {
  throw new Error(error.message || "Something went wrong");
}
```

### 2. Provide Specific Error Codes

```tsx
// ✅ Good
throw new AuthenticationError(
  AppErrorCode.AUTH_INVALID_CREDENTIALS,
  ERROR_MESSAGES[AppErrorCode.AUTH_INVALID_CREDENTIALS]
);

// ❌ Bad
throw new Error("Login failed");
```

### 3. Use Hooks for Consistent UX

```tsx
// ✅ Good - Automatic loading states, error handling, retry logic
const { execute, loading, error, retry } = useAsyncOperation(operation);

// ❌ Bad - Manual state management
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### 4. Handle Errors at the Right Level

- **Service Level**: Normalize and throw structured errors
- **Hook Level**: Provide retry and state management
- **Component Level**: Display errors and handle user actions
- **App Level**: Catch unhandled errors with ErrorBoundary

## Testing

The error system is fully testable:

```tsx
import { normalizeError, AppErrorCode } from "@/shared/errors";

test("should normalize Supabase auth errors", () => {
  const supabaseError = { message: "Invalid login credentials" };
  const normalized = normalizeError(supabaseError);

  expect(normalized.code).toBe(AppErrorCode.AUTH_INVALID_CREDENTIALS);
  expect(normalized.userMessage).toBe(
    "Invalid email or password. Please try again."
  );
});
```

## Monitoring and Logging

Errors are automatically logged with context:

```tsx
// Development: Console logging
// Production: Send to monitoring service (Sentry, LogRocket, etc.)

const errorLog = {
  timestamp: error.timestamp,
  code: error.code,
  category: error.category,
  severity: error.severity,
  userAgent: navigator.userAgent,
  url: window.location.href,
  userId: getCurrentUserId(),
};
```

## Migration Guide

### From Manual Error Handling

```tsx
// Before
try {
  const result = await operation();
} catch (error) {
  setError(error instanceof Error ? error.message : "Error occurred");
}

// After
const { execute, error } = useAsyncOperation(operation);
const result = await execute();
// Error handling is automatic
```

### From Custom Error States

```tsx
// Before
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// After
const { execute, loading, error } = useAsyncOperation(operation);
```

This system eliminates repetitive error handling code while providing a consistent, user-friendly experience across the entire application.
