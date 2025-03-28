import React, { useEffect } from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import classnames from 'classnames';
import AudioRecorder from '~/uikit/content/components/audioRecorder';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';
import Body from '~/uikit/content/components/body';
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
  onPermissionDenied,
  onRemoveAudioClicked,
  onAudioRecording
}) => {
  let audioSrc;
  let transcript;
  if (tracking.audio) {
    audioSrc = getAssetUrl(tracking.audio, "original");
    transcript = tracking.audio.transcript;
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
            if (status === 'recording') {
              onAudioRecording();
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
              onRemoveAudioClicked={onRemoveAudioClicked}
            />

          )
        }}
      />
      {(transcript) && (
        <div className="p-4 bg-lm-2/20 dark:bg-dm-1/60 rounded-md mt-4">
          <div>
            <Body body="Transcript" size="xs" />
          </div>
          <div>
            <Body body={transcript} size="sm" />
          </div>
        </div>
      )}
    </div>
  );
};

export default InputPromptAudioBlockPlayer;