import React from 'react';
import BlocksEditorContainer from '~/modules/blocks/containers/blocksEditorContainer';
import CreateWorkspaceToolbarContainer from '../containers/createWorkspaceToolbarContainer';

const CreateWorkspace = ({
  displayMode
}) => {
  return (
    <div className="w-full h-full">
      <div className="flex justify-center">
        <CreateWorkspaceToolbarContainer />
      </div>
      {(displayMode === 'EDITING') && (
        <div className="pt-10 w-full h-full overflow-y-auto">
          <BlocksEditorContainer />
        </div>
      )}
    </div>
  );
};

export default CreateWorkspace;