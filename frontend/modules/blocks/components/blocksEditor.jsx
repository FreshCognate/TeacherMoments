import React from 'react';
import BlocksEditorItem from './blocksEditorItem';
import map from 'lodash/map';

const BlocksEditor = ({
  blocks,
  onDeleteBlockClicked,
  onSortUpClicked,
  onSortDownClicked
}) => {
  return (
    <div className="w-full border border-lm-2 dark:border-dm-2 max-w-screen-sm">
      {map(blocks, (block) => {
        return (
          <BlocksEditorItem
            key={block._id}
            block={block}
            isLastBlock={block.sortOrder === blocks.length - 1}
            onDeleteBlockClicked={onDeleteBlockClicked}
            onSortUpClicked={onSortUpClicked}
            onSortDownClicked={onSortDownClicked}
          />
        );
      })}
    </div>
  );
};

export default BlocksEditor;