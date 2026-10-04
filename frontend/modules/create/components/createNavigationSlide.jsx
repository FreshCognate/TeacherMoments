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
  isNestedStem,
  canDeleteSlides,
  hasChildStems,
  onDuplicateSlideClicked,
  onDeleteSlideClicked,
  onCreateStemClicked
}) => {

  const shouldShowIcon = !isInRootStem && !isNestedStem;

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
        isAnimating={shouldShowIcon}
        draggingOptions={draggingOptions}
        onDuplicateSlideClicked={onDuplicateSlideClicked}
        onDeleteSlideClicked={onDeleteSlideClicked}
        onCreateStemClicked={onCreateStemClicked}
      />
    </div>
  );
};

export default CreateNavigationSlide;