import React from 'react';
import ScenarioBuilderItemContainer from '../containers/scenarioBuilderItemContainer';
import ScenarioEditorToolbarContainer from '~/modules/scenarios/containers/scenarioEditorToolbarContainer';
import ScenarioPreviewContainer from '~/modules/scenarios/containers/scenarioPreviewContainer';

const ScenarioBuilder = ({
  rootSlide,
  displayMode,
  slideSelection
}) => {
  const backgroundDotColor = '#454545'
  return (
    <div className="bg-lm-1 dark:bg-dm-0 h-screen" style={{
      backgroundSize: "20px 20px",
      backgroundPosition: "-9px -9px",
      backgroundImage: displayMode === 'EDITING' ? `radial-gradient(${backgroundDotColor} 1px, transparent 0)` : 'none',
    }}>
      <div className="flex p-5 justify-center">
        <ScenarioEditorToolbarContainer isNewEditor />
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