import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';
import classnames from 'classnames';
import EditBlockContainer from '../containers/editBlockContainer';

const BlocksEditorItem = ({
  block,
  isLastBlock,
  isEditing,
  isSelected,
  onDeleteBlockClicked,
  onSortUpClicked,
  onSortDownClicked,
  onBlockClicked,
  onCancelEditBlockClicked,
  onEditBlockClicked
}) => {

  return (
    <div className={classnames("mb-3 bg-lm-1 dark:bg-dm-1 border border-lm-2 dark:border-dm-2 outline-2 rounded-md cursor-pointer group", {
      "outline outline-primary-regular dark:outline-primary-light": isSelected,
      "hover:outline hover:outline-lm-2 hover:dark:outline-dm-2": !isSelected
    })} onClick={() => {
      if (!isEditing) {
        onBlockClicked(block._id)
      }
    }}>
      <div className="p-4 flex items-center justify-between">
        <div>
          <Body body={` Block Item : ${block.blockType}`} size="sm" />
        </div>
        <div className="opacity-0 group-hover:opacity-100">
          {(isEditing) && (
            <FlatButton icon="done" text="Done" size="sm" color="primary" onClick={(event) => {
              event.stopPropagation();
              onCancelEditBlockClicked(block._id);
            }} />
          )}
          {(!isEditing) && (
            <FlatButton icon="edit" text="Edit" color="primary" size="sm" onClick={(event) => {
              event.stopPropagation();
              onEditBlockClicked(block._id);
            }} />
          )}
        </div>
      </div>
      <div className="cursor-auto">

        {(isEditing) && (
          <EditBlockContainer blockId={block._id} />
        )}
      </div>
      {(!isEditing) && (
        <div className="flex items-center justify-between bg-lm-2 cursor-auto dark:bg-dm-2 px-2 py-1 opacity-0 group-hover:opacity-100">
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
      )}
    </div>
  );
};

export default BlocksEditorItem;