import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';
import Body from '~/uikit/content/components/body';
import InputPromptTextBlockPlayer from './inputPromptTextBlockPlayer';
import InputPromptAudioBlockPlayer from './inputPromptAudioBlockPlayer';

const InputPromptBlockPlayer = ({
  block,
  tracking,
  hasAudioLoaded,
  isAudioDisabled,
  onSubmitButtonClicked,
  onTextInputChanged,
  onAudioLoaded,
  onAudioRecorded,
  onPermissionDenied
}) => {
  return (
    <div>
      <div className="mb-2">
        <Body body={getString({ model: block, field: 'body' })} />
      </div>

      {(block.inputType === 'AUDIO' && !isAudioDisabled) && (
        <InputPromptAudioBlockPlayer
          block={block}
          tracking={tracking}
          hasAudioLoaded={hasAudioLoaded}
          onAudioLoaded={onAudioLoaded}
          onAudioRecorded={onAudioRecorded}
          onPermissionDenied={onPermissionDenied}
        />
      )}

      {(block.inputType === 'TEXT' || isAudioDisabled) && (
        <InputPromptTextBlockPlayer
          block={block}
          tracking={tracking}
          onTextInputChanged={onTextInputChanged}
          onSubmitButtonClicked={onSubmitButtonClicked}
        />
      )}

    </div >
  );
};

export default InputPromptBlockPlayer;