import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';

const BlocksEditorItem = ({
  block,
  isLastBlock,
  onDeleteBlockClicked,
  onSortUpClicked,
  onSortDownClicked
}) => {
  return (
    <div className="min-h-40 cursor-pointer border-b border-lm-2 dark:border-dm-2 last:border-none outline-2 hover:outline outline-lm-3 dark:outline-dm-3">
      <div className="flex items-center justify-between bg-lm-1 dark:bg-dm-1 px-2 py-1">
        <div className="flex items-center">
          <FlatButton icon="delete" onClick={() => onDeleteBlockClicked(block._id)} />
        </div>
        <div className="flex items-center">
          <FlatButton icon="sortUp" className="mr-3" isDisabled={block.sortOrder === 0} onClick={() => onSortUpClicked(block.sortOrder)} />
          <FlatButton icon="sortDown" isDisabled={isLastBlock} onClick={() => onSortDownClicked(block.sortOrder)} />
        </div>
      </div>
      <div className="p-4">
        <Body body={` Block Item : ${block.blockType}`} />
      </div>
    </div>
  );
};

export default BlocksEditorItem;