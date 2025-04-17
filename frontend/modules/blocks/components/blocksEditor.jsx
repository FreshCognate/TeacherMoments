import React from 'react';
import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import EditBlockContainer from '../containers/editBlockContainer';
import Icon from '~/uikit/icons/components/icon';
import Body from '~/uikit/content/components/body';

const BlocksEditor = ({
  blocks,
  isLockedFromEditing,
  onSortUpClicked,
  onSortDownClicked,
  onCreateBlockClicked,
  onRequestAccessClicked
}) => {
  return (
    <div className="w-full pt-4 pb-8 px-8 max-w-screen-lg mx-auto">
      <div className="relative">
        {(isLockedFromEditing) && (
          <div
            className="flex justify-center items-start absolute w-full h-full top-0 z-20 right-0 p-1 bg-opacity-40 bg-white dark:bg-black dark:bg-opacity-80 rounded-lg"
          >
            <div className="flex items-center pt-8 sticky top-0">
              <div className="mr-2">
                <Icon icon="locked" />
              </div>
              <div>
                <Body body="Another user is editing this slide" size="sm" />
                <FlatButton
                  text="Request access?"
                  color="primary"
                  onClick={onRequestAccessClicked}
                />
              </div>
            </div>
          </div>
        )}

        {(map(blocks, (block) => {
          return (
            <EditBlockContainer
              key={block._id}
              block={block}
              blocksLength={blocks.length}
              onSortUpClicked={onSortUpClicked}
              onSortDownClicked={onSortDownClicked}
            />
          )
        }))}
        <div className="pl-2">
          <FlatButton
            text="Add block"
            icon="create"
            onClick={onCreateBlockClicked}
          />
        </div>
      </div>
    </div>
  );
};

export default BlocksEditor;