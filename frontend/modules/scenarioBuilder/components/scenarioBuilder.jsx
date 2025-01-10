import React from 'react';
import ScenarioBuilderItemContainer from '../containers/scenarioBuilderItemContainer';

const ScenarioBuilder = ({
  rootSlide
}) => {
  const backgroundDotColor = '#454545'
  return (
    <div className="bg-lm-1 dark:bg-dm-0 h-screen" style={{
      backgroundSize: "20px 20px",
      backgroundPosition: "-9px -9px",
      backgroundImage: `radial-gradient(${backgroundDotColor} 1px, transparent 0)`,
    }}>
      <div className="flex justify-center pt-5">
        <ScenarioBuilderItemContainer
          slide={rootSlide}
        />
      </div>
    </div>
  );
};

export default ScenarioBuilder;