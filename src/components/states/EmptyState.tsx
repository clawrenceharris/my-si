import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

/**
 * Available variants for empty state display
 */
export type EmptyVariant = "default" | "minimal" | "card" | "inline";

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
  /** The display variant - affects layout and styling */
  variant?: EmptyVariant;
  /** The empty state title/heading */
  title?: string;
  /** Descriptive text explaining the empty state */
  description?: string;
  /** Custom icon to display (overrides default) */
  icon?: React.ReactNode;
  /** Text for the primary action button */
  actionLabel?: string;
  /** Callback for the primary action */
  onAction?: () => void;
  /** Text for the secondary action button */
  secondaryActionLabel?: string;
  /** Callback for the secondary action */
  onSecondaryAction?: () => void;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * EmptyState component provides consistent empty state display with action buttons.
 *
 * This component handles empty data scenarios with appropriate visual feedback
 * and user actions. It supports multiple variants for different UI contexts and
 * provides customizable primary and secondary actions to guide users.
 *
 * @example
 * ```tsx
 * // Default empty state with action
 * <EmptyState
 *   title="No habitats found"
 *   description="Create your first habitat to get started"
 *   actionLabel="Create Habitat"
 *   onAction={handleCreate}
 * />
 *
 * // Minimal empty state
 * <EmptyState
 *   variant="minimal"
 *   title="No messages"
 *   actionLabel="Send first message"
 *   onAction={handleSend}
 * />
 *
 * // Card with primary and secondary actions
 * <EmptyState
 *   variant="card"
 *   title="No discussions yet"
 *   actionLabel="Start Discussion"
 *   onAction={handleStart}
 *   secondaryActionLabel="Browse Topics"
 *   onSecondaryAction={handleBrowse}
 * />
 * ```
 *
 * @param props - The component props
 * @returns An empty state component with optional action buttons
 */
export function EmptyState({
  variant = "default",
  title = "No items found",
  description = "There are no items to display at the moment.",
  icon,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  const renderActions = () => {
    if (!onAction && !onSecondaryAction) return null;

    return (
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onAction && actionLabel && (
          <Button onClick={onAction} variant="default">
            {actionLabel}
          </Button>
        )}
        {onSecondaryAction && secondaryActionLabel && (
          <Button onClick={onSecondaryAction} variant="outline">
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    );
  };

  const renderMinimal = () => (
    <div
      className={cn("empty-state", "empty-state-minimal", className)}
      data-testid="empty-state"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon && icon}

        <span className="text-sm">{title}</span>
        {onAction && actionLabel && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onAction}
            className="h-auto p-1 text-xs"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );

  const renderInline = () => (
    <div
      className={cn("empty-state", "empty-state-inline", className)}
      data-testid="empty-state"
    >
      <div className="flex items-center gap-3 p-4 bg-muted/30 border border-border rounded-lg">
        {icon && icon}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {onAction && actionLabel && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className="flex-shrink-0"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );

  const renderCard = () => (
    <div
      className={cn("empty-state", "empty-state-card", className)}
      data-testid="empty-state"
    >
      <div className="p-6 bg-card border border-border rounded-lg text-center">
        {icon && <div className="flex justify-center mb-4">{icon}</div>}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {description}
          </p>
        )}
        {renderActions()}
      </div>
    </div>
  );

  const renderDefault = () => (
    <div
      className={cn("empty-state", "empty-state-default", className)}
      data-testid="empty-state"
    >
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        {icon && <div className="mb-4">{icon}</div>}
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        )}
        {renderActions()}
      </div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case "minimal":
        return renderMinimal();
      case "inline":
        return renderInline();
      case "card":
        return renderCard();
      case "default":
      default:
        return renderDefault();
    }
  };

  return renderVariant();
}
