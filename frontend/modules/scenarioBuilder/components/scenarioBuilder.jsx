import React from 'react';
import ScenarioBuilderItemContainer from '../containers/scenarioBuilderItemContainer';
import ScenarioEditorToolbarContainer from '~/modules/scenarios/containers/scenarioEditorToolbarContainer';
import ScenarioPreviewContainer from '~/modules/scenarios/containers/scenarioPreviewContainer';

const ScenarioBuilder = ({
  rootSlide,
  displayMode,
  slideSelection
}) => {
  const isDarkMode = window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
  const backgroundDotColor = isDarkMode ? '#222' : '#ddd'

  return (
    <div className="bg-lm-1 dark:bg-dm-0 pt-10 min-h-screen" style={{
      backgroundSize: "20px 20px",
      backgroundPosition: "-9px -9px",
      backgroundImage: displayMode === 'EDITING' ? `radial-gradient(${backgroundDotColor} 1px, transparent 0)` : 'none',
      paddingBottom: '200vh'
    }}>
      <div className="flex p-5 justify-center">
        <ScenarioEditorToolbarContainer />
      </div>
      <div className="flex justify-center pt-5">
        {(displayMode === 'EDITING') && (
          <ScenarioBuilderItemContainer
            slide={rootSlide}
            slideSelection={slideSelection}
            layerIndex={-1}
            isSelected={true}
          />
        )}
        {(displayMode === 'PREVIEW') && (
          <ScenarioPreviewContainer />
        )}
      </div>
    </div>
  );
};

export default ScenarioBuilder;