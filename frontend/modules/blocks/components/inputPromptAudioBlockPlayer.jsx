import React, { useEffect } from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import AudioRecorder from '~/uikit/content/components/audioRecorder';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';
let ReactMediaRecorder = null;
if (typeof window !== 'undefined') {
  await import('react-media-recorder').then((mod) => {
    ReactMediaRecorder = mod.ReactMediaRecorder;
  });
}

const InputPromptAudioBlockPlayer = ({
  block,
  tracking,
  isUploadingAudio,
  uploadProgress,
  onAudioRecorded,
  onPermissionDenied
}) => {
  let audioSrc;
  if (tracking.audio) {
    audioSrc = getAssetUrl(tracking.audio);
  }
  return (
    <div>
      <ReactMediaRecorder
        audio
        render={({ error, status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl }) => {

          useEffect(() => {
            if (mediaBlobUrl) {
              onAudioRecorded(mediaBlobUrl);
            }
          }, [mediaBlobUrl]);

          return (
            <AudioRecorder
              status={status}
              error={error}
              startRecording={startRecording}
              stopRecording={stopRecording}
              clearBlobUrl={clearBlobUrl}
              audioSrc={audioSrc}
              isUploadingAudio={isUploadingAudio}
              uploadProgress={uploadProgress}
              onPermissionDenied={onPermissionDenied}
            />

          )
        }}
      />
    </div>
  );
};

export default InputPromptAudioBlockPlayer;