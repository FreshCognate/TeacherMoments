import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Body from '~/uikit/content/components/body';
import InputPromptTextBlockPlayer from './inputPromptTextBlockPlayer';
import InputPromptAudioBlockPlayer from './inputPromptAudioBlockPlayer';
import Required from '~/uikit/alerts/components/required';

const InputPromptBlockPlayer = ({
  block,
  tracking,
  isAudioDisabled,
  isResponseBlock,
  isUploadingAudio,
  uploadProgress,
  uploadStatus,
  onTextInputChanged,
  onAudioRecorded,
  onPermissionDenied,
  onRemoveAudioClicked
}) => {
  return (
    <div>
      <div className="mb-2 relative">
        <Body body={getString({ model: block, field: 'body' })} />
        <div className="absolute -top-3 right-0">
          <Required isRequired={block.isRequired} isComplete={tracking.isAbleToComplete} />
        </div>
      </div>

      {(block.inputType === 'AUDIO' && !isAudioDisabled) && (
        <InputPromptAudioBlockPlayer
          block={block}
          tracking={tracking}
          isResponseBlock={isResponseBlock}
          isUploadingAudio={isUploadingAudio}
          uploadProgress={uploadProgress}
          uploadStatus={uploadStatus}
          onAudioRecorded={onAudioRecorded}
          onPermissionDenied={onPermissionDenied}
          onRemoveAudioClicked={onRemoveAudioClicked}
        />
      )}

      {(block.inputType === 'TEXT' || isAudioDisabled) && (
        <InputPromptTextBlockPlayer
          block={block}
          tracking={tracking}
          isResponseBlock={isResponseBlock}
          onTextInputChanged={onTextInputChanged}
        />
      )}

    </div >
  );
};

export default InputPromptBlockPlayer;