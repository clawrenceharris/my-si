import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppError, ErrorSeverity } from "../errors/types";
import { cn } from "@/lib/utils";

function getErrorIcon(severity: ErrorSeverity) {
  switch (severity) {
    case ErrorSeverity.LOW:
      return Info;
    case ErrorSeverity.MEDIUM:
      return AlertCircle;
    case ErrorSeverity.HIGH:
      return AlertTriangle;
    case ErrorSeverity.CRITICAL:
      return XCircle;
    default:
      return AlertCircle;
  }
}

interface ErrorDisplayProps {
  error: AppError | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className,
}: ErrorDisplayProps) {
  if (!error) return null;

  const Icon = getErrorIcon(error.severity);

  return (
    <div
      className={cn(
        "rounded-lg border border-red-200 bg-red-50 p-4",
        "dark:border-red-800 dark:bg-red-950",
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {error.userMessage}
          </p>
          {error.metadata?.field && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Field: {error.metadata.field}
            </p>
          )}
        </div>
      </div>

      {(error.canRetry && onRetry) || onDismiss ? (
        <div className="mt-3 flex gap-2">
          {error.canRetry && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="h-8 px-3 text-xs"
            >
              Try Again
            </Button>
          )}
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-8 px-3 text-xs"
            >
              Dismiss
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
