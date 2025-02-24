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
  onAudioLoaded
}) => {
  console.log(hasAudioLoaded);
  return (
    <div>
      <ReactMediaRecorder
        render={({ status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl }) => {

          return (
            <AudioRecorder
              status={status}
              startRecording={startRecording}
              stopRecording={stopRecording}
              clearBlobUrl={clearBlobUrl}
              mediaBlobUrl={mediaBlobUrl}
              hasAudioLoaded={hasAudioLoaded}
              onAudioLoaded={onAudioLoaded}
            />

          )
        }}
      />
    </div>
  );
};

export default InputPromptAudioBlockPlayer;