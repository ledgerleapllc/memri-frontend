import { Button } from '@shared/partials/Button';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../Provider';

interface ConfirmDialogOptions {
  title: string;
  content: string;
  open?: boolean;
  type: 'purchase' | 'delete' | 'login' | 'report';
  fontSizeContent?: string;
  colorContent?: string;
  onClick?: (event: any) => void;
  close?: () => void;
}

const ConfirmDialog = (props: ConfirmDialogOptions) => {
  const { title, content, type, onClick, close, fontSizeContent = 'text-2.75', colorContent = 'text-gray1', ...otherProps } = props;

  const { t } = useTranslation('common');

  const handleSubmit = (event: any) => {
    if (onClick && typeof onClick === 'function') {
      onClick(event);
      close && close();
    }
  };

  return (
    <Dialog {...otherProps} className='p-4 rounded-lg' showCloseBtn={false} close={close}>
      <Dialog.Header className='text-3.75 font-semibold'>{t(title)}</Dialog.Header>
      <Dialog.Body className={classNames('pt-2', fontSizeContent, colorContent)}>{t(content)}</Dialog.Body>
      <Dialog.Footer className='pt-10 flex justify-end gap-2'>
        <Button onClick={close}>{t('cancel')}</Button>
        <Button variant='contained' onClick={handleSubmit}>
          {t(type)}
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};

export default ConfirmDialog;
