import React from 'react';
import InputPromptTextBlockPlayer from '~/modules/blocks/components/inputPromptTextBlockPlayer';
import MultipleChoicePromptBlockPlayer from '~/modules/blocks/components/multipleChoicePromptBlockPlayer';
import Button from '~/uikit/buttons/components/button';

const EditPromptCondition = ({
  prompt,
  blockTracking,
  onAnswerClicked,
  onRemoveSelectionClicked,
  onTextInputChanged
}) => {

  let Component;

  if (prompt.blockType === 'MULTIPLE_CHOICE_PROMPT') {
    Component = MultipleChoicePromptBlockPlayer;
  }

  if (prompt.blockType === 'INPUT_PROMPT') {
    Component = InputPromptTextBlockPlayer;
  }

  return (
    <div className="p-4">
      <Component
        block={prompt}
        blockTracking={blockTracking}
        isResponseBlock={false}
        onAnswerClicked={onAnswerClicked}
        onTextInputChanged={onTextInputChanged}
      />
      {(prompt.blockType === 'MULTIPLE_CHOICE_PROMPT') && (
        <div>
          <Button text="Remove selection" onClick={onRemoveSelectionClicked} />
        </div>
      )}
    </div>
  );
};

export default EditPromptCondition;