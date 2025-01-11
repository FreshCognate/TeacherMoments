import React from 'react';
import ScenarioBuilderItemContainer from '../containers/scenarioBuilderItemContainer';
import ScenarioEditorToolbarContainer from '~/modules/scenarios/containers/scenarioEditorToolbarContainer';

const ScenarioBuilder = ({
  rootSlide,
  slideSelection
}) => {
  const backgroundDotColor = '#454545'
  return (
    <div className="bg-lm-1 dark:bg-dm-0 h-screen" style={{
      backgroundSize: "20px 20px",
      backgroundPosition: "-9px -9px",
      backgroundImage: `radial-gradient(${backgroundDotColor} 1px, transparent 0)`,
    }}>
      <div className="flex p-5 justify-center">
        <ScenarioEditorToolbarContainer />
      </div>
      <div className="flex justify-center pt-5">
        <ScenarioBuilderItemContainer
          slide={rootSlide}
          slideSelection={slideSelection}
          layerIndex={-1}
          isSelected={true}
        />
      </div>
    </div>
  );
};

export default ScenarioBuilder;