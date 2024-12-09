import React from 'react';
import BlocksEditorContainer from '~/modules/blocks/containers/blocksEditorContainer';
import SlidesPanelContainer from '~/modules/slides/containers/slidesPanelContainer';
import ScenarioEditorToolbarContainer from '../containers/scenarioEditorToolbarContainer';

const CreateScenario = ({
  displayMode
}) => {
  return (
    <div className="flex justify-between" style={{ height: 'calc(100vh - 68px)' }}>
      <div className="bg-lm-1 dark:bg-dm-1 rounded-lg min-w-60 ml-2 my-2 border border-lm-2 dark:border-dm-2">
        <SlidesPanelContainer />
      </div>
      <div className="w-full my-2 flex flex-col items-center">
        <ScenarioEditorToolbarContainer />
        {(displayMode === 'EDITING') && (
          <BlocksEditorContainer />
        )}
        {(displayMode === 'PREVIEW') && (
          <div className="w-full border border-lm-1 dark:border-dm-1 max-w-screen-sm">
            Preview content
          </div>
        )}
      </div>
      <div className="bg-lm-1 dark:bg-dm-1 text-xs p-4 rounded-lg min-w-60 mr-2 my-2 border border-lm-2 dark:border-dm-2">
        Right side panel
      </div>
    </div>
  );
};

export default CreateScenario;