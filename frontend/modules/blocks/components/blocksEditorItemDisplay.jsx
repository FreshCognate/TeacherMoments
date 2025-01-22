import React from 'react';
import TextBlockPlayer from './textBlockPlayer';
import PromptBlockPlayer from './promptBlockPlayer';
import ActionsBlockPlayer from './actionsBlockPlayer';
const COMPONENT_MAPPINGS = {
  TEXT: TextBlockPlayer,
  ANSWERS_PROMPT: PromptBlockPlayer,
  ACTIONS: ActionsBlockPlayer
}

const BlocksEditorItemDisplay = ({
  block
}) => {
  const Component = COMPONENT_MAPPINGS[block.blockType];
  return (
    <div className="bg-lm-0 dark:bg-dm-1 p-4">
      <Component block={block} tracking={{}} isEditor />
    </div>
  );
};

export default BlocksEditorItemDisplay;