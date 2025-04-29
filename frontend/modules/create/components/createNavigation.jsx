import React from 'react';
import CreateNavigationActions from './createNavigationActions';
import CreateNavigationSlide from './createNavigationSlide';
import CreateDroppableContainer from '../containers/createDroppableContainer';
import filter from 'lodash/filter';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Button from '~/uikit/buttons/components/button';

const CreateNavigation = ({
  scenarioId,
  slides,
  blocks,
  selectedSlideId,
  isCreating,
  deletingId,
  isDuplicating,
  onAddSlideClicked,
  onDuplicateSlideClicked,
  onDeleteSlideClicked
}) => {
  return (
    <div className="bg-lm-1 dark:bg-dm-1 w-full max-w-64 h-full flex flex-col">
      <CreateNavigationActions isCreating={isCreating} isDuplicating={isDuplicating} onAddSlideClicked={onAddSlideClicked} />
      <div className="p-2 overflow-y-scroll">
        <CreateDroppableContainer
          id={`slides`}
          items={slides}
          data={{
            type: 'SLIDES'
          }}
          renderItem={({ item, index, items, draggingOptions }) => {

            const canDeleteSlides = items.length > 1;
            let isSelected = false;
            let isDeletingSlide = false;
            if (item._id === selectedSlideId) isSelected = true;
            if (item._id === deletingId) isDeletingSlide = true;
            const slideBlocks = filter(blocks, { slideRef: item.ref });

            return (
              <CreateNavigationSlide
                key={item._id}
                scenarioId={scenarioId}
                slide={item}
                slideBlocks={slideBlocks}
                draggingOptions={draggingOptions}
                isSelected={isSelected}
                isDeleting={isDeletingSlide}
                isDuplicating={isDuplicating}
                canDeleteSlides={canDeleteSlides}
                onDuplicateSlideClicked={onDuplicateSlideClicked}
                onDeleteSlideClicked={onDeleteSlideClicked}
              />
            );

          }}
        />
      </div>
      <div className="p-2 border-t border-t-lm-2 dark:border-t-dm-2">
        <Button icon="finish" text="Navigation" className="bg-lm-2  dark:bg-dm-2" isFullWidth />
      </div>
    </div>
  );
};

export default CreateNavigation;