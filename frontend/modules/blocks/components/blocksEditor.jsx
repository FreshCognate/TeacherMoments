import React from 'react';
import map from 'lodash/map';
import FlatButton from '~/uikit/buttons/components/flatButton';
import EditBlockContainer from '../containers/editBlockContainer';

const BlocksEditor = ({
  blocks,
  onCreateBlockClicked
}) => {
  return (
    <div className="w-full pt-4 pb-8 max-w-screen-sm mx-auto">
      {(map(blocks, (block) => {
        return (
          <EditBlockContainer
            key={block._id}
            blockId={block._id}
          />
        )
      }))}
      <div className="pl-2">
        <FlatButton
          text="Create block"
          icon="create"
          onClick={onCreateBlockClicked}
        />
      </div>
    </div>
  );
};

export default BlocksEditor;