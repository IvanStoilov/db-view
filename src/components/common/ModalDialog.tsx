import React, { ReactNode, useImperativeHandle, useState } from "react";

type ModalDialogOptions = {
  content: ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
};

type ModalDialogContext = ModalDialogOptions & {
  isOpen: boolean;
};

export type ModalDialogHandle = {
  open: (options: ModalDialogOptions) => void;
};

const ModalDialog: React.ForwardRefRenderFunction<ModalDialogHandle, {}> = (
  props,
  forwardedRef
) => {
  const [context, setContext] = useState<ModalDialogContext | null>(null);

  useImperativeHandle(forwardedRef, () => {
    return {
      open,
    };
  });

  return (
    <div className={"modal" + (context?.isOpen ? " is-active" : "")}>
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <div className="mb-5">{context ? context.content : null}</div>
          <div>
            <button className="button is-primary" onClick={onOk}>
              Ok
            </button>
            <button className="button ml-3" onClick={onCancel}>
              Close
            </button>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close"></button>
    </div>
  );

  function onOk() {
    close();
    if (context?.onOk) {
      context.onOk();
    }
  }

  function onCancel() {
    close();
    if (context?.onCancel) {
      context.onCancel();
    }
  }

  function open(options: ModalDialogOptions) {
    setContext({
      ...options,
      isOpen: true,
    });
  }

  function close() {
    if (context) {
      setContext({
        ...context,
        isOpen: false,
      });
    }
  }
};

export default React.forwardRef(ModalDialog);
