import React from 'react';
import BlocksEditorContainer from '~/modules/blocks/containers/blocksEditorContainer';
import CreateWorkspaceToolbarContainer from '../containers/createWorkspaceToolbarContainer';
import ScenarioPreviewContainer from '~/modules/scenarios/containers/scenarioPreviewContainer';

const CreateWorkspace = ({
  activeSlideRef,
  activeSlideId,
  displayMode
}) => {
  return (
    <div className="w-full h-full">
      <div className="flex justify-center">
        <CreateWorkspaceToolbarContainer
          activeSlideRef={activeSlideRef}
        />
      </div>
      {(displayMode === 'EDITING') && (
        <div className="pt-10 w-full h-full overflow-y-auto">
          {(activeSlideRef) && (
            <BlocksEditorContainer
              slideId={activeSlideId}
            />
          )}
        </div>
      )}
      {(displayMode === 'PREVIEW') && (
        <div className="pt-10 w-full h-full overflow-y-auto">
          <div className="w-full pt-4 pb-8 px-8 max-w-lg mx-auto">
            <ScenarioPreviewContainer slideRef={activeSlideRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateWorkspace;