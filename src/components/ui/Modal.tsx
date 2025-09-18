import { CSSProperties, forwardRef, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from "./";

export interface ModalProps {
  onClose?: () => void;
  children?: ReactNode;
  contentStyle?: CSSProperties;
  title: string;
  hidesDescription?: boolean;
  isOpen?: boolean;
  description?: string;
}
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      contentStyle,
      hidesDescription,
      title,
      isOpen,
      onClose,
      description,
      children,
    },
    ref
  ) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent style={contentStyle} ref={ref} className="sm:max-w-md">
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription
                className={`${hidesDescription ? "sr-only" : ""}`}
              >
                {description}
              </DialogDescription>
            )}
          </DialogHeader>

          {children}
        </DialogContent>
      </Dialog>
    );
  }
);

Modal.displayName = "Modal";
