import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui";
import React, { cloneElement, useCallback, useState } from "react";

export interface ModalProps {
  onClose?: () => void;
  children?: React.ReactElement<{ description?: string }>;
  title: string;

  hidesDescription?: boolean;
  isOpen?: boolean;
  description?: string;
  submitText?: string;
}
export const useModal = ({
  onClose,
  description,
  title,
  hidesDescription,
  children,
}: ModalProps) => {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => {
    setOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);
  const handleOpenChange = () => {
    if (open) {
      closeModal();
    } else {
      openModal();
    }
  };
  const ModalComponent = (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogOverlay className="z-99" />
        <DialogContent className="z-999 overflow-hidden max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <DialogDescription className={`${hidesDescription ? "sr-only" : ""}`}>
            {description}
          </DialogDescription>
          <div className="h-full overflow-auto">
            {React.isValidElement(children)
              ? cloneElement(children, { description })
              : children}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );

  return {
    modal: ModalComponent,
    closeModal,
    openModal,
    isModalOpen: open,
  };
};
