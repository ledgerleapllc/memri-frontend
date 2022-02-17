import { ReactComponent as IconX } from 'assets/icons/ic-x.svg';
import classNames from 'classnames';
import React, { cloneElement, useState } from 'react';
import styles from './style.module.scss';
const ZINDEX_DEFAULT = 1000;

// Common dialog Context
const DialogContext = React.createContext({});

// Create `useDialog` hook that using DialogContext
const useDialog = () => {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

const DialogProvider = (props) => {
  const [dialogs, setDialogs] = useState([]);

  const appendDialog = (dialog) => {
    setDialogs([...dialogs, dialog]);
  };

  const openDialog = (dialog) => {
    setDialogs([dialog]);
  };

  const closeAllDialogs = () => {
    setDialogs([]);
  };

  const closeCurrentDialog = (index) => {
    dialogs.splice(index, 1);
    setDialogs([...dialogs]);
  };

  const renderDialogView = (dialog, index) => {
    return cloneElement(dialog, {
      close: (data) => {
        if (
          dialog.props.afterClosed &&
          typeof dialog.props.afterClosed === 'function'
        ) {
          dialog.props?.afterClosed(data);
        }

        closeCurrentDialog(index);
      },
    });
  };

  return (
    <DialogContext.Provider
      value={{ appendDialog, closeAllDialogs, closeCurrentDialog, openDialog }}
    >
      {dialogs?.length > 0 && (
        <>
          {dialogs.map((dialog, index) => (
            <div key={`dialog-${index}`}>
              <div
                className={styles.dialogBackdrop}
                style={{ zIndex: ZINDEX_DEFAULT + index + index }}
              />
              <div
                className={classNames(styles.dialogWrapper, styles.flexCenter)}
                style={{ zIndex: ZINDEX_DEFAULT + index + index + 1 }}
                onClick={() => closeCurrentDialog(index)}
              >
                {renderDialogView(dialog, index)}
              </div>
            </div>
          ))}
        </>
      )}
      {props.children}
    </DialogContext.Provider>
  );
};

const Dialog = (props) => {
  const { showCloseBtn = true, className, closeRight = false, close } = props;

  return (
    <div
      className={classNames(className, styles.dialogContainer)}
      onClick={(e) => e.stopPropagation()}
    >
      {showCloseBtn && (
        <button
          className={classNames('absolute z-10 text-white text-2xl', {
            'top-5 left-5': !closeRight,
            'top-5 right-5': closeRight,
          })}
          onClick={close}
        >
          <IconX />
        </button>
      )}

      {props.children}
    </div>
  );
};

Dialog.Header = (props) => (
  <div className={classNames(styles.dialogHeader, props.className)}>
    {props.children}
  </div>
);

Dialog.Body = (props) => (
  <div className={classNames(styles.dialogBody, props.className)}>
    {props.children}
  </div>
);

Dialog.Footer = (props) => (
  <div className={classNames(styles.dialogFooter, props.className)}>
    {props.children}
  </div>
);

export { DialogProvider, Dialog, useDialog };
