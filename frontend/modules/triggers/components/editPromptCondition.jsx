import React from 'react';
import MultipleChoicePromptBlockPlayer from '~/modules/blocks/components/multipleChoicePromptBlockPlayer';

const EditPromptCondition = ({
  prompt,
  blockTracking,
  onAnswerClicked
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
    </div>
  );
};

export default EditPromptCondition;