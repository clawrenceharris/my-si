import { Modal, ModalProps } from "@/components/ui/Modal";
import { cloneElement, useCallback, useRef, useState } from "react";

export const useModal = ({ onClose, children, ...props }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    onClose?.();
  }, [onClose]);

  const ModalComponent = (
    <Modal isOpen={isModalOpen} ref={modalRef} onClose={closeModal} {...props}>
      {cloneElement(children, { description: props.description })}
    </Modal>
  );

  return {
    closeModal,
    openModal,
    modal: isModalOpen ? ModalComponent : null,
    isModalOpen,
  };
};
