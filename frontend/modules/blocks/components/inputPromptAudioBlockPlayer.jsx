import React, { useEffect } from 'react';
import AudioRecorder from '~/uikit/content/components/audioRecorder';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';
import Body from '~/uikit/content/components/body';
import Alert from '~/uikit/alerts/components/alert';
let ReactMediaRecorder = null;
if (typeof window !== 'undefined') {
  await import('react-media-recorder').then((mod) => {
    ReactMediaRecorder = mod.ReactMediaRecorder;
  });
}

const InputPromptAudioBlockPlayer = ({
  block,
  blockTracking,
  isUploadingAudio,
  isTranscribingAudio,
  uploadProgress,
  uploadStatus,
  onAudioRecorded,
  onPermissionDenied,
  onRemoveAudioClicked,
  onAudioRecording
}) => {
  let audioSrc;
  let transcript;
  if (blockTracking.audio) {
    audioSrc = getAssetUrl(blockTracking.audio, "original");
    transcript = blockTracking.audio.transcript;
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
      {(audioSrc && !isTranscribingAudio && !transcript) && (
        <div className="mt-4">
          <Alert type="warning" text="Transcription process completed, however it appears your audio recording is empty. Please try recording your response again." />
        </div>
      )}
      {(isTranscribingAudio) && (
        <div className="mt-4">
          <Alert type="warning" text="Transcribing audio..." />
        </div>
      )}
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