/* eslint-disable @typescript-eslint/no-explicit-any */
// Error severity levels
export enum ErrorSeverity {
  LOW = "low", // Non-critical, user can continue
  MEDIUM = "medium", // Important but recoverable
  HIGH = "high", // Critical, blocks user flow
  CRITICAL = "critical", // System failure, requires immediate attention
}

// Error categories for better organization
export enum ErrorCategory {
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  VALIDATION = "validation",
  NETWORK = "network",
  DATABASE = "database",
  EXTERNAL_API = "external_api",
  BUSINESS_LOGIC = "business_logic",
  SYSTEM = "system",
}

// Centralized error codes with user-friendly messages
export enum AppErrorCode {
  // Authentication Errors
  AUTH_INVALID_CREDENTIALS = "auth_invalid_credentials",
  AUTH_USER_NOT_FOUND = "auth_user_not_found",
  AUTH_EMAIL_NOT_CONFIRMED = "auth_email_not_confirmed",
  AUTH_PASSWORD_TOO_WEAK = "auth_password_too_weak",
  AUTH_EMAIL_ALREADY_EXISTS = "auth_email_already_exists",
  AUTH_SESSION_EXPIRED = "auth_session_expired",
  AUTH_RATE_LIMITED = "auth_rate_limited",

  // Session Management Errors
  SESSION_NOT_FOUND = "session_not_found",
  SESSION_ALREADY_STARTED = "session_already_started",
  SESSION_CAPACITY_FULL = "session_capacity_full",
  SESSION_ACCESS_DENIED = "session_access_denied",

  // Student Check-in Errors
  CHECKIN_ALREADY_CHECKED_IN = "checkin_already_checked_in",
  CHECKIN_SESSION_NOT_ACTIVE = "checkin_session_not_active",
  CHECKIN_INVALID_CODE = "checkin_invalid_code",

  // Network Errors
  NETWORK_OFFLINE = "network_offline",
  NETWORK_TIMEOUT = "network_timeout",
  NETWORK_SERVER_ERROR = "network_server_error",

  // Validation Errors
  VALIDATION_REQUIRED_FIELD = "validation_required_field",
  VALIDATION_INVALID_EMAIL = "validation_invalid_email",
  VALIDATION_INVALID_FORMAT = "validation_invalid_format",

  // Generic Errors
  UNKNOWN_ERROR = "unknown_error",
  PERMISSION_DENIED = "permission_denied",
  RESOURCE_NOT_FOUND = "resource_not_found",
}

// Base application error class
export class AppError extends Error {
  public readonly code: AppErrorCode;
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly userMessage: string;
  public readonly canRetry: boolean;
  public readonly metadata?: Record<string, any>;
  public readonly timestamp: Date;

  constructor(
    code: AppErrorCode,
    category: ErrorCategory,
    severity: ErrorSeverity,
    userMessage: string,
    canRetry: boolean = false,

    metadata?: Record<string, any>
  ) {
    super(userMessage);
    this.name = "AppError";
    this.code = code;
    this.category = category;
    this.severity = severity;
    this.userMessage = userMessage;
    this.canRetry = canRetry;
    this.metadata = metadata;
    this.timestamp = new Date();
  }
}

// Specific error types for different scenarios
export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(
      AppErrorCode.VALIDATION_INVALID_FORMAT,
      ErrorCategory.VALIDATION,
      ErrorSeverity.MEDIUM,
      message,
      false,
      { field }
    );
    this.name = "ValidationError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string, canRetry: boolean = true) {
    super(
      AppErrorCode.NETWORK_SERVER_ERROR,
      ErrorCategory.NETWORK,
      ErrorSeverity.HIGH,
      message,
      canRetry
    );
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends AppError {
  constructor(code: AppErrorCode, message: string) {
    super(
      code,
      ErrorCategory.AUTHENTICATION,
      ErrorSeverity.HIGH,
      message,
      false
    );
    this.name = "AuthenticationError";
  }
}
