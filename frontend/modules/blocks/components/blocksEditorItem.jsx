import React from 'react';

const BlocksEditorItem = ({
  block
}) => {
  return (
    <div className="min-h-40 border-b border-lm-1 dark:border-dm-1 hover:outline outline-primary-regular dark:outline-primary-light">
      Block Item {`: ${block.blockType}`}
    </div>
  );
};

export default BlocksEditorItem;