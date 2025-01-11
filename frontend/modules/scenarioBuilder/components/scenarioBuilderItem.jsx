import React from 'react';
import Badge from '~/uikit/badges/components/badge';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Title from '~/uikit/content/components/title';
import ScenarioBuilderItemContainer from '../containers/scenarioBuilderItemContainer';
import getCache from '~/core/cache/helpers/getCache';
import map from 'lodash/map';
import Icon from '~/uikit/icons/components/icon';

const ScenarioBuilderItem = ({
  slide,
  slideSelection,
  layerIndex,
  isSelected,
  childrenOffset,
  shouldRenderChildren,
  onAddChildSlideClicked,
  onToggleChildSlidesClicked,
  onSelectSlideClicked
}) => {
  const newLayerIndex = layerIndex + 1;
  return (
    <div className="">
      <div className="flex justify-center">
        <div className="relative">
          <div className="relative border border-lm-3 dark:border-dm-3 bg-lm-0 dark:bg-dm-1 p-2 rounded-lg w-64 h-20 group transition-transform duration-700"
            style={{ transform: `scale(${isSelected ? 1 : 0.8})` }}
          >
            {!isSelected && (
              <div
                className="group-hover:flex justify-center items-center hidden cursor-pointer absolute w-full h-full top-0 right-0 p-1 bg-opacity-40 bg-white dark:bg-black dark:bg-opacity-40 rounded-bl-lg rounded-tr-lg"
                onClick={onSelectSlideClicked}
              >
                <div>
                  <Icon icon="select" />
                </div>
              </div>
            )}
            {slide.isRoot && (
              <Badge text="Root" />
            )}
            <Title title={slide.name} />
          </div>
          {(isSelected) && (
            <div className="absolute z-10 -bottom-8 flex justify-center items-center w-full left-0">
              <div className="mx-1">
                <FlatButton icon="add" isCircular onClick={onAddChildSlideClicked} />
              </div>
              {slide.children.length > 0 && (
                <div className="mx-1">
                  <FlatButton icon={shouldRenderChildren ? "close" : "open"} isCircular onClick={() => onToggleChildSlidesClicked(shouldRenderChildren ? 'CLOSE' : 'OPEN')} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {(slide.children.length > 0 && shouldRenderChildren) && (
        <div className="flex justify-start pt-10 pb-7 w-64 transition-transform duration-500" style={{ transform: `translateX(${childrenOffset}px)` }}>
          {map(slide.children, (ref, index) => {
            const childSlide = getCache('slides').data.find(s => s.ref === ref);
            const isSelected = slideSelection[newLayerIndex] === index;
            return (
              <div
                key={childSlide._id}
                className="mr-4"
              >
                <ScenarioBuilderItemContainer
                  slide={childSlide}
                  itemIndex={index}
                  layerIndex={newLayerIndex}
                  isSelected={isSelected}
                  slideSelection={slideSelection}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default ScenarioBuilderItem;