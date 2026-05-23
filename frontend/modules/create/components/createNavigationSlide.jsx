import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateStemsContainer from '../containers/createStemsContainer';
import Flag from '~/modules/flags/components/flag';
import CreateNavigationSlideIcon from './createNavigationSlideIcon';
import CreateNavigationSlidePreview from './createNavigationSlidePreview';

const TRANSITION = { duration: 0.25, ease: 'easeInOut' };

const CreateNavigationSlide = ({
  scenarioId,
  slide,
  slideBlocks,
  slideTriggers,
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
    <div>
      <CreateNavigationSlidePreview
        scenarioId={scenarioId}
        slide={slide}
        slideBlocks={slideBlocks}
        slideTriggers={slideTriggers}
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

      <Flag>
        <CreateStemsContainer slideRef={slide.ref} isInRootStem={isInRootStem} />
      </Flag>

    </div>
  );
};

export default CreateNavigationSlide;