import React from 'react';
import Badge from '~/uikit/badges/components/badge';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Title from '~/uikit/content/components/title';
import ScenarioBuilderItemContainer from '../containers/scenarioBuilderItemContainer';
import getCache from '~/core/cache/helpers/getCache';
import map from 'lodash/map';

const ScenarioBuilderItem = ({
  slide,
  slideSelection,
  layerIndex,
  shouldRenderChildren,
  onAddChildSlideClicked,
  onToggleChildSlidesClicked
}) => {
  return (
    <div className="">
      <div className="flex justify-center">
        <div className="relative border border-lm-2 dark:border-dm-2 bg-lm-0 dark:bg-dm-1 p-2 rounded-lg w-64 h-20">
          {slide.isRoot && (
            <Badge text="Root" />
          )}
          <Title title={slide.name} />
          <div className="absolute -bottom-8 flex justify-center items-center w-full left-0">
            <div className="mx-1">
              <FlatButton icon="add" isCircular onClick={onAddChildSlideClicked} />
            </div>
            {slide.children.length > 0 && (
              <div className="mx-1">
                <FlatButton icon={shouldRenderChildren ? "close" : "open"} isCircular onClick={() => onToggleChildSlidesClicked(shouldRenderChildren ? 'CLOSE' : 'OPEN')} />
              </div>
            )}
          </div>
        </div>
      </div>
      {(slide.children.length > 0 && shouldRenderChildren) && (
        <div className="flex justify-center pt-10 pb-7">
          {map(slide.children, (ref, index) => {
            const childSlide = getCache('slides').data.find(s => s.ref === ref);
            return (
              <div
                key={childSlide._id}
                className="mx-2"
              >
                <ScenarioBuilderItemContainer
                  slide={childSlide}
                  itemIndex={index}
                  layerIndex={layerIndex + 1}
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