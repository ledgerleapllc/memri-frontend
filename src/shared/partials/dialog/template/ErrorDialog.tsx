import React from 'react';
import { Button } from '@shared/partials/Button';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../Provider';
interface ErrorDialogOptions {
  title: string;
  content: string;
  actionText?: string;
  close?: () => void;
  statusCode? : number;
}

const ErrorDialog = (props: ErrorDialogOptions) => {
  const { title, content, close, actionText, statusCode, ...otherProps } = props;
  const { t } = useTranslation(['errors', 'common']);

  const handleClose = () => {
    close && close();
    if (statusCode === 401) {
      window.location.href = '/vod';
    }
  };

  return (
    <Dialog {...otherProps} className='p-5 rounded-lg' closeRight close={close}>
      <Dialog.Header className='text-3.75 text-danger2 font-semibold'>
        {t(title, { ns: 'common' })}
      </Dialog.Header>
      <Dialog.Body className='text-3.25 pt-2 whitespace-break'>
        {t(content, { ns: 'errors' })}
      </Dialog.Body>
      <Dialog.Footer className='pt-5 flex justify-end'>
        <Button
          variant='outline'
          color='danger'
          onClick={handleClose}
        >
          {actionText ? actionText : 'OK'}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};

export default ErrorDialog;
