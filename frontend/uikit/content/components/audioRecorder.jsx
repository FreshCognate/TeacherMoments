import React, { useEffect, useRef } from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import Timer from '~/uikit/timers/components/timer';
import addModal from '~/core/dialogs/helpers/addModal';

const MAX_RECORDING_TIME_SECONDS = 480; // 8 minutes

const AudioRecorder = ({
  status,
  error,
  startRecording,
  stopRecording,
  clearBlobUrl,
  audioSrc,
  isUploadingAudio,
  isDisabled,
  uploadProgress,
  uploadStatus,
  onPermissionDenied,
  onRemoveAudioClicked
}) => {

  let recordButtonIcon = status === 'recording' ? 'recording' : 'record';
  const recordButtonClassName = classnames("rounded-full p-2 bg-lm-3 dark:bg-dm-3", {
    "animate-pulse": status === 'recording'
  });

  let statusText = "Press microphone to start recording...";
  let hasRemoveAudioButton = false;

  if (audioSrc) {
    statusText = "Audio saved. Press record to try again.";
    hasRemoveAudioButton = true;
  }

  if (status === 'recording') {
    statusText = "Press microphone to stop recording";
  }

  if (isUploadingAudio) {
    statusText = "Uploading audio";
  }

  if (uploadStatus) {
    statusText = uploadStatus;
  }

  const maxTimeoutRef = useRef(null);

  useEffect(() => {
    if (error === 'permission_denied') {
      onPermissionDenied();
    }
  }, [error]);

  useEffect(() => {
    if (status === 'recording') {
      maxTimeoutRef.current = setTimeout(() => {
        stopRecording();
      }, MAX_RECORDING_TIME_SECONDS * 1000);
    } else {
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
        maxTimeoutRef.current = null;
      }
    }

    return () => {
      if (maxTimeoutRef.current) {
        clearTimeout(maxTimeoutRef.current);
      }
    };
  }, [status, stopRecording]);

  return (
    <div>
      <div className="p-2 bg-lm-2/60 dark:bg-dm-2 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
          <FlatButton
            icon={recordButtonIcon}
            isCircular
            className={recordButtonClassName}
            color="warning"
            isDisabled={isDisabled}
            onClick={() => {
              if (status === 'recording') {
                stopRecording();
              } else {
                startRecording();
              }
            }}
          />
          {(isUploadingAudio) && (
            <div className="ml-2 text-sm text-black/60 dark:text-white/60">
              {`${uploadProgress}%`}
            </div>
          )}
          {(status === 'recording') && (
            <div className="ml-2 text-sm text-black/60 dark:text-white/60">
              <Timer maxTime={MAX_RECORDING_TIME_SECONDS} />
            </div>
          )}
          <div className="ml-2 text-sm text-black/60 dark:text-white/60">
            {statusText}
          </div>
        </div>
        <div>
          {(hasRemoveAudioButton) && (
            <FlatButton icon="delete" title="Delete audio" color="warning" isDisabled={isDisabled} onClick={() => {
              addModal({
                title: 'Are you sure you want to remove this audio?',
                body: 'This cannot be undone',
                actions: [{
                  type: 'CANCEL',
                  text: 'Cancel'
                }, {
                  type: 'REMOVE',
                  text: 'Remove',
                  color: 'warning'
                }]
              }, (type, payload) => {
                if (payload.type === 'REMOVE') {
                  clearBlobUrl();
                  onRemoveAudioClicked();
                }
              })
            }} />
          )}
        </div>
      </div>
      {(audioSrc) && (
        <div className="mt-2 w-full">
          <audio className="w-full" key={audioSrc} src={audioSrc} preload='true' controls controlsList="nodownload">
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;