import React from 'react';
import Body from '~/uikit/content/components/body';
import Title from '~/uikit/content/components/title';

const BlockSelector = ({
  onAddBlockTypeClicked
}) => {
  return (
    <div>
      <div className="bg-lm-0 dark:bg-dm-0 border-t border-lm-1 dark:border-dm-1 p-4 cursor-pointer hover:bg-lm-1 dark:hover:bg-dm-1 transition-colors" onClick={() => onAddBlockTypeClicked('TEXT')}>
        <Title title="Text" element="h4" />
        <Body
          body="A rich text editor. Great for adding instructions or detailing a scene."
          size="sm"
          className="opacity-60"
        />
      </div>
      <div className="bg-lm-0 dark:bg-dm-0 border-t border-lm-1 dark:border-dm-1 p-4 cursor-pointer hover:bg-lm-1 dark:hover:bg-dm-1 transition-colors" onClick={() => onAddBlockTypeClicked('ANSWERS_PROMPT')}>
        <Title title="Answers prompt" element="h4" />
        <Body
          body="A prompt with predefined answers for the user to select."
          size="sm"
          className="opacity-60"
        />
      </div>
    </div>
  );
};

export default BlockSelector;