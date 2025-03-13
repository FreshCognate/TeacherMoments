import React from 'react';
import BlocksEditorContainer from '~/modules/blocks/containers/blocksEditorContainer';

const CreateWorkspace = ({
  displayMode
}) => {
  return (
    <div className="w-full h-full">
      {(displayMode === 'EDITING') && (
        <div>
          <BlocksEditorContainer />
        </div>
      )}
    </div>
  );
};

export default CreateWorkspace;