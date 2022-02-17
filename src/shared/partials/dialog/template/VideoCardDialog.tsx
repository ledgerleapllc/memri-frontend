import { formatDate, formatVideoDuration } from '@shared/core/utils';
import { VODVideo, TVVideo } from '@shared/models/Video';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Dialog } from '../Provider';
import styles from './style.module.scss';

interface VideoCardDialogOptions {
  className?: string;
  video: VODVideo | TVVideo;
}

export const VideoCardDialog = (props: VideoCardDialogOptions) => {
  const { className, video, ...otherProps } = props;

  const { t } = useTranslation('common');

  return (
    <Dialog {...otherProps} className={classNames(className)}>
      <Dialog.Header>
        <div className='aspect-w-9 aspect-h-5'>
          <img className='image-full-box' src={video.thumbnail} />
          <div className={styles.dialogImageOverlay}></div>
        </div>
      </Dialog.Header>
      <Dialog.Body className='m-4 overflow-auto max-h-48'>
        <p className='text-2.75 text-gray1 flex items-center gap-2'>
          {formatVideoDuration(video.duration)}
          <span className='w-1 h-1 rounded-full bg-gray1'></span>
          {t('duration_coming', {
            time: formatDate(+video.scheduleDate, t('schedule_date_popup_type')),
          })}
        </p>
        <h2 className={'py-1 text-3.75 whitespace-break font-semibold'}>
          {video.name}
        </h2>
        <p className='text-2.75 text-gray1 whitespace-break'>
          {video.description}
        </p>
      </Dialog.Body>
    </Dialog>
  );
};
