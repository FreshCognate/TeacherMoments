import React from 'react';
import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import EditBlockContainer from '../containers/editBlockContainer';

const BlocksEditor = ({
  blocks,
  onSortUpClicked,
  onSortDownClicked,
  onCreateBlockClicked
}) => {
  return (
    <div className="w-full pt-4 pb-8 px-8 max-w-screen-lg mx-auto">
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
  );
};

export default BlocksEditor;