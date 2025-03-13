import React from 'react';
import map from 'lodash/map';
import CreateNavigationSlide from './createNavigationSlide';
import CreateNavigationActions from './createNavigationActions';

const CreateNavigation = ({
  slides,
  isCreating,
  onAddSlideClicked
}) => {
  return (
    <div className="bg-lm-1 dark:bg-dm-1 w-full max-w-64 h-full overflow-y-scroll">
      <CreateNavigationActions isCreating={isCreating} onAddSlideClicked={onAddSlideClicked} />
      <div className="p-2">
        {(map(slides, (slide) => {
          return (
            <CreateNavigationSlide
              key={slide._id}
              slide={slide}
            />
          );
        }))}
      </div>
    </div>
  );
};

export default CreateNavigation;