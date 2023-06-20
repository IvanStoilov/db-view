import { ReactNode, useState } from "react";

export type ModalOptions = {
  title?: string;
  content: ReactNode;
  hideOk?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
};

export function useModal() {
  const [options, setOptions] = useState<ModalOptions | null>(null);

  function showModal(options: ModalOptions) {
    setOptions(options);
  }

  function hideModal() {
    setOptions(null);
  }

  return {
    options,
    showModal,
    hideModal,
  };
}
