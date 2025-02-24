import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
let ReactMediaRecorder = null;
if (typeof window !== 'undefined') {
  await import('react-media-recorder').then((mod) => {
    ReactMediaRecorder = mod.ReactMediaRecorder;
  });
}

const InputPromptAudioBlockPlayer = ({
  hasAudioLoaded,
  onAudioLoaded
}) => {
  console.log(hasAudioLoaded);
  return (
    <div>
      <ReactMediaRecorder
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => {
          let recordButtonIcon = status === 'recording' ? 'recording' : 'record';
          const recordButtonClassName = classnames("rounded-full p-2 bg-lm-3 dark:bg-dm-3", {
            "animate-pulse": status === 'recording'
          })
          return (
            <div>
              <div className="p-2 bg-lm-2/60 dark:bg-dm-2 rounded-lg">
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
              </div>
              {(mediaBlobUrl) && (
                <div className="mt-2 w-full">
                  <audio src={mediaBlobUrl} className="w-full" controls onLoadedMetadata={onAudioLoaded} />
                </div>
              )}
            </div>
          )
        }}
      />
    </div>
  );
};

export default InputPromptAudioBlockPlayer;