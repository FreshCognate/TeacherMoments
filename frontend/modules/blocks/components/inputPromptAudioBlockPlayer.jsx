import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import AudioRecorder from '~/uikit/content/components/audioRecorder';
let ReactMediaRecorder = null;
if (typeof window !== 'undefined') {
  await import('react-media-recorder').then((mod) => {
    ReactMediaRecorder = mod.ReactMediaRecorder;
  });
}

const InputPromptAudioBlockPlayer = ({
  hasAudioLoaded,
  onAudioLoaded,
  onAudioRecorded,
  onPermissionDenied
}) => {
  return (
    <div>
      <ReactMediaRecorder
        render={({ error, status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl }) => {
          console.log(error, status);
          return (
            <AudioRecorder
              status={status}
              error={error}
              startRecording={startRecording}
              stopRecording={() => {
                onAudioRecorded();
                stopRecording();
              }}
              clearBlobUrl={clearBlobUrl}
              mediaBlobUrl={mediaBlobUrl}
              hasAudioLoaded={hasAudioLoaded}
              onAudioLoaded={onAudioLoaded}
              onPermissionDenied={onPermissionDenied}
            />

          )
        }}
      />
    </div>
  );
};

export default InputPromptAudioBlockPlayer;