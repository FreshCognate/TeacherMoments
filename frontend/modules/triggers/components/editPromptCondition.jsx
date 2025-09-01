import React from 'react';
import MultipleChoicePromptBlockPlayer from '~/modules/blocks/components/multipleChoicePromptBlockPlayer';
import Button from '~/uikit/buttons/components/button';

const EditPromptCondition = ({
  prompt,
  blockTracking,
  onAnswerClicked,
  onRemoveSelectionClicked
}) => {

  let Component;

  if (prompt.blockType === 'MULTIPLE_CHOICE_PROMPT') {
    Component = MultipleChoicePromptBlockPlayer;
  }

  return (
    <div className="p-4">
      <Component
        block={prompt}
        blockTracking={blockTracking}
        isResponseBlock={false}
        onAnswerClicked={onAnswerClicked}
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