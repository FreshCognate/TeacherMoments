import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';

const BlocksEditorItem = ({
  block,
  onDeleteBlockClicked
}) => {
  return (
    <div className="min-h-40 border-b border-lm-1 dark:border-dm-1 outline-2 hover:outline outline-lm-3 dark:outline-dm-3">
      <div className="flex items-center bg-lm-1 dark:bg-dm-1 px-2 py-1">
        <FlatButton icon="delete" onClick={() => onDeleteBlockClicked(block._id)} />
      </div>
      <div className="p-4">
        <Body body={` Block Item : ${block.blockType}`} />
      </div>
    </div>
  );
};

export default BlocksEditorItem;