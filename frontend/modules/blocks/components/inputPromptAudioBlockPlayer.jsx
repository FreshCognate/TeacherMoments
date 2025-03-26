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
  uploadStatus,
  onAudioRecorded,
  onPermissionDenied
}) => {
  let audioSrc;
  if (tracking.audio) {
    audioSrc = getAssetUrl(tracking.audio, "original");
  }
  return (
    <div>
      <ReactMediaRecorder
        audio
        render={({ error, status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl }) => {

          useEffect(() => {
            if (mediaBlobUrl && status === 'stopped') {
              onAudioRecorded(mediaBlobUrl);
            }
          }, [mediaBlobUrl, status]);

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
              uploadStatus={uploadStatus}
              onPermissionDenied={onPermissionDenied}
            />

          )
        }}
      />
    </div>
  );
};

export default InputPromptAudioBlockPlayer;