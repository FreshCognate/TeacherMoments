import React from 'react';
import map from 'lodash/map';
import CreateNavigationActions from './createNavigationActions';
import CreateNavigationSlide from './createNavigationSlide';
import CreateDroppableContainer from '../containers/createDroppableContainer';

const CreateNavigation = ({
  scenarioId,
  slides,
  selectedSlideId,
  isCreating,
  deletingId,
  onAddSlideClicked,
  onDeleteSlideClicked
}) => {
  return (
    <div className="bg-lm-1 dark:bg-dm-1 w-full max-w-64 h-full overflow-y-scroll">
      <CreateNavigationActions isCreating={isCreating} onAddSlideClicked={onAddSlideClicked} />
      <div className="p-2">
        <CreateDroppableContainer
          id={`slides`}
          items={slides}
          data={{
            type: 'SLIDES'
          }}
          renderItem={({ item, index, items, draggingOptions }) => {

            let isSelected = false;
            let isDeletingSlide = false;
            if (item._id === selectedSlideId) isSelected = true;
            if (item._id === deletingId) isDeletingSlide = true;
            return (
              <CreateNavigationSlide
                key={item._id}
                scenarioId={scenarioId}
                slide={item}
                draggingOptions={draggingOptions}
                isSelected={isSelected}
                isDeleting={isDeletingSlide}
                onDeleteSlideClicked={onDeleteSlideClicked}
              />
            );

          }}
        />
      </div>
    </div>
  );
};

export default CreateNavigation;