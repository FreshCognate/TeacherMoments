import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';
import classnames from 'classnames';
import getBlockDisplayName from '../helpers/getBlockDisplayName';

const BlocksEditorItem = ({
  block,
  isLastBlock,
  isSelected,
  onDeleteBlockClicked,
  onSortUpClicked,
  onSortDownClicked,
  onEditBlockClicked
}) => {

  return (
    <div className={classnames("mb-3 bg-lm-1 dark:bg-dm-1 border border-lm-3 dark:border-dm-3 outline-2 rounded-md group/block", {
      "outline outline-primary-regular dark:outline-primary-light": isSelected,
      "hover:outline hover:outline-lm-2 hover:dark:outline-dm-2": !isSelected
    })}>
      <div className="p-3 flex items-center justify-between">
        <div>
          <div className="mb-2">
            <Body body={` Block: ${getBlockDisplayName(block)}`} size="sm" />
          </div>
        </div>
        <div className="opacity-0 group-hover/block:opacity-100">
          <FlatButton icon="edit" text="Edit" color="primary" size="sm" onClick={(event) => {
            event.stopPropagation();
            onEditBlockClicked(block._id);
          }} />
        </div>
      </div>

      <div className="flex items-center justify-between bg-lm-2 cursor-auto dark:bg-dm-2 px-2 py-1 opacity-0 group-hover/block:opacity-100">
        <div className="flex items-center">
          <FlatButton icon="delete" color="warning" onClick={() => onDeleteBlockClicked(block._id)} />
        </div>
        <div className="flex items-center">
          {(block.sortOrder !== 0) && (
            <FlatButton icon="sortUp" className="ml-3" onClick={() => onSortUpClicked(block.sortOrder)} />
          )}
          {(!isLastBlock) && (
            <FlatButton icon="sortDown" className="ml-3" onClick={() => onSortDownClicked(block.sortOrder)} />
          )}
        </div>
      </div>

    </div>
  );
};

export default BlocksEditorItem;