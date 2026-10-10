import React from 'react';
import BlocksEditorContainer from '~/modules/blocks/containers/blocksEditorContainer';
import CreateWorkspaceToolbarContainer from '../containers/createWorkspaceToolbarContainer';
import CreateStaticSlideEditorContainer from '../containers/createStaticSlideEditorContainer';
import PlayScenarioContainer from '~/modules/scenarios/containers/playScenarioContainer';
import SlideActionsContainer from '~/modules/slides/containers/slideActionsContainer';
import CreateOverviewContainer from '../containers/createOverviewContainer';

const CreateWorkspace = ({
  activeSlideId,
  displayMode,
  isOverviewVisible,
  isStaticSlide
}) => {

  return (
    <div id="create-workspace-container" className="w-full h-full ml-4 border border-lm-3 bg-lm-0 dark:bg-dm-1 dark:border-dm-1 rounded-lg overflow-y-auto">
      <div className="flex justify-center sticky top-0 z-30">
        <CreateWorkspaceToolbarContainer
          activeSlideId={activeSlideId}
          isStaticSlide={isStaticSlide}
        />
      </div>
      {(displayMode === 'EDITING' && !isOverviewVisible) && (
        <>
          {(isStaticSlide) && (
            <CreateStaticSlideEditorContainer key={activeSlideId} type={activeSlideId} />
          )}
          {(!isStaticSlide && activeSlideId) && (
            <BlocksEditorContainer
              slideId={activeSlideId}
            />
          )}
          {(!isStaticSlide) && (
            <SlideActionsContainer activeSlideId={activeSlideId} />
          )}
        </>
      )}
      {(isOverviewVisible) && (
        <div>
          <CreateOverviewContainer />
        </div>
      )}
      {(displayMode === 'PREVIEW' && !isOverviewVisible) && (
        <div>
          <PlayScenarioContainer />
        </div>
      )}
    </div>
  );
};

export default CreateWorkspace;