import React from 'react';
import map from 'lodash/map';
import ScenarioBuilderItemContainer from '../containers/scenarioBuilderItemContainer';
import getCache from '~/core/cache/helpers/getCache';

const ScenarioBuilderItemChildren = ({
  children,
  parent,
  slideSelection,
  newLayerIndex,
  childrenOffset
}) => {
  return (
    <div className="flex justify-start pt-10 pb-7 w-[440px] transition-transform duration-500" style={{
      transform: `translateX(${childrenOffset}px)`,
    }}>
      {map(children, (ref, index) => {
        const childSlide = getCache('slides').data.find(s => s.ref === ref);
        if (!childSlide) return null;
        const isSelected = slideSelection[newLayerIndex] === index;
        return (
          <div
            key={childSlide._id}
            className="mr-4"
          >
            <ScenarioBuilderItemContainer
              slide={childSlide}
              parent={parent}
              itemIndex={index}
              layerIndex={newLayerIndex}
              isSelected={isSelected}
              slideSelection={slideSelection}
            />
          </div>
        )
      })}
    </div>
  );
};

export default ScenarioBuilderItemChildren;