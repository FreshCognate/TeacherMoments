import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';

const AudioRecorder = ({
  status,
  startRecording,
  stopRecording,
  clearBlobUrl,
  mediaBlobUrl,
  hasAudioLoaded,
  onAudioLoaded
}) => {
  let recordButtonIcon = status === 'recording' ? 'recording' : 'record';
  const recordButtonClassName = classnames("rounded-full p-2 bg-lm-3 dark:bg-dm-3", {
    "animate-pulse": status === 'recording'
  });
  let statusText = "Press microphone to start recording...";
  let hasRemoveAudioButton = false;
  if (mediaBlobUrl) {
    statusText = "Audio has been saved!";
    hasRemoveAudioButton = true;
  }
  return (
    <div>
      <div className="p-2 bg-lm-2/60 dark:bg-dm-2 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
          <FlatButton
            icon={recordButtonIcon}
            isCircular
            className={recordButtonClassName}
            color="warning"
            onClick={() => {
              if (status === 'recording') {
                stopRecording();
              } else {
                startRecording();
              }
            }}
          />
          <div className="ml-2 text-sm text-black/60 dark:text-white/60">
            {statusText}
          </div>
        </div>
        <div>
          {(hasRemoveAudioButton) && (
            <FlatButton icon="delete" onClick={clearBlobUrl} />
          )}
        </div>
      </div>
      {(mediaBlobUrl) && (
        <div className="mt-2 w-full">
          <audio className="w-full" controls controlsList="nodownload" onCanPlayThrough={onAudioLoaded}>
            <source src={mediaBlobUrl} />
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;