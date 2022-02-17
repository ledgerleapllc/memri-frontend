import { Dialog } from '../Provider';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/partials/Button';

interface NotificationDialogOptions {
  className?: string;
  text: string;
  title?: string;
  onAccept?: () => void;
  close?: () => void;
}

export const NotificationDialog = ({
  text,
  title,
  close,
  onAccept,
  ...otherProps
}: NotificationDialogOptions) => {
  const { t } = useTranslation('common');
  const handleClosePopup = () => {
    close && close();
    if (onAccept && typeof onAccept === 'function') {
      onAccept();
    }
  };
  return (
    <Dialog {...otherProps} className='p-5 rounded-lg' closeRight close={close}>
      {
        title ? (
        <Dialog.Header className='text-3.75 text-left font-semibold'>
        {t(title)}
      </Dialog.Header>) : ''
      }
      <Dialog.Body>
        <p className='pt-2'>{text}</p>
      </Dialog.Body>
      <Dialog.Footer className='pt-10 flex justify-end'>
        <Button variant='contained' onClick={handleClosePopup}>
          OK
        </Button>
      </Dialog.Footer>
    </Dialog>
  );
};
