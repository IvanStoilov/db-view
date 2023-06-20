import React, { ReactNode } from "react";
import { useAppContext } from "../../hooks/AppContext";

type ModalDialogOptions = {
  content: ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
};

export type ModalDialogHandle = {
  open: (options: ModalDialogOptions) => void;
};

export function ModalDialog() {
  const { modal } = useAppContext();

  return (
    <div className={"modal" + (modal.options ? " is-active" : "")}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <div className="mb-5">
            {modal.options ? modal.options.content : null}
          </div>
          <div>
            {!modal.options?.hideOk && (
              <button className="button mr-3 is-primary" onClick={onOk}>
                Ok
              </button>
            )}
            <button className="button" onClick={onCancel}>
              Close
            </button>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  );

  function onOk() {
    modal.hideModal();
    if (modal.options?.onOk) {
      modal.options.onOk();
    }
  }

  function onCancel() {
    modal.hideModal();
    if (modal.options?.onCancel) {
      modal.options.onCancel();
    }
  }
}
