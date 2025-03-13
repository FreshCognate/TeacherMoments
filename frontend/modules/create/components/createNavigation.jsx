import React from 'react';
import map from 'lodash/map';
import CreateNavigationActions from './createNavigationActions';
import CreateNavigationSlide from './createNavigationSlide';

const CreateNavigation = ({
  scenarioId,
  slides,
  selectedSlideId,
  isCreating,
  onAddSlideClicked
}) => {
  return (
    <div className="bg-lm-1 dark:bg-dm-1 w-full max-w-64 h-full overflow-y-scroll">
      <CreateNavigationActions isCreating={isCreating} onAddSlideClicked={onAddSlideClicked} />
      <div className="p-2">
        {(map(slides, (slide) => {
          let isSelected = false;
          if (slide._id === selectedSlideId) isSelected = true;
          return (
            <CreateNavigationSlide
              key={slide._id}
              scenarioId={scenarioId}
              slide={slide}
              isSelected={isSelected}
            />
          );
        }))}
      </div>
    </div>
  );
};

export default CreateNavigation;