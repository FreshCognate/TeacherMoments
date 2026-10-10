import React from 'react';
import CreateStemsContainer from '../containers/createStemsContainer';
import CreateNavigationSlidePreview from './createNavigationSlidePreview';

const CreateNavigationSlide = ({
  scenarioId,
  slide,
  slideBlocks,
  slideTrigger,
  draggingOptions = {},
  isSelected,
  isDeleting,
  isDuplicating,
  isInRootStem,
  canDeleteSlides,
  hasChildStems,
  onDuplicateSlideClicked,
  onDeleteSlideClicked,
}) => {

  return (
    <div className="mb-2">
      <CreateNavigationSlidePreview
        scenarioId={scenarioId}
        slide={slide}
        slideBlocks={slideBlocks}
        slideTrigger={slideTrigger}
        canDeleteSlides={canDeleteSlides}
        isInRootStem={isInRootStem}
        hasChildStems={hasChildStems}
        isSelected={isSelected}
        isDeleting={isDeleting}
        isDuplicating={isDuplicating}
        draggingOptions={draggingOptions}
        onDuplicateSlideClicked={onDuplicateSlideClicked}
        onDeleteSlideClicked={onDeleteSlideClicked}
      />
    </div>
  );
};

export default CreateNavigationSlide;