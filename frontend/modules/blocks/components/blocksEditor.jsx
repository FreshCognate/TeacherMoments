import React from 'react';
import BlocksEditorItem from './blocksEditorItem';
import map from 'lodash/map';

const BlocksEditor = ({
  blocks,
  selectedBlockId,
  isEditingBlock,
  onDeleteBlockClicked,
  onSortUpClicked,
  onSortDownClicked,
  onBlockClicked,
  onCancelEditBlockClicked,
  onEditBlockClicked
}) => {
  return (
    <div className="w-full pt-2 max-w-screen-sm">
      {map(blocks, (block) => {

        const isSelected = (block._id === selectedBlockId);

        const isEditing = isEditingBlock && isSelected;

        return (
          <BlocksEditorItem
            key={block._id}
            block={block}
            isSelected={isSelected}
            isEditing={isEditing}
            isLastBlock={block.sortOrder === blocks.length - 1}
            onDeleteBlockClicked={onDeleteBlockClicked}
            onSortUpClicked={onSortUpClicked}
            onSortDownClicked={onSortDownClicked}
            onBlockClicked={onBlockClicked}
            onCancelEditBlockClicked={onCancelEditBlockClicked}
            onEditBlockClicked={onEditBlockClicked}
          />
        );
      })}
    </div>
  );
};

export default BlocksEditor;