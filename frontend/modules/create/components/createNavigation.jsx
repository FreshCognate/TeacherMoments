import React from 'react';
import map from 'lodash/map';
import CreateNavigationSlide from './createNavigationSlide';

const CreateNavigation = ({
  slides
}) => {
  console.log(slides);
  return (
    <div className="bg-lm-1 dark:bg-dm-1  w-full max-w-64 h-full">
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