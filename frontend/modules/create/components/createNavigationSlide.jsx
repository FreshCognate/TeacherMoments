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
  activeStem,
  activeSlideStems,
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
  const layoutId = `slide-${slide._id}`;

  return (
    <div>
      <AnimatePresence initial={false} mode="popLayout">
        {shouldShowIcon ? (
          <motion.div
            key="icon"
            layoutId={layoutId}
            transition={TRANSITION}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CreateNavigationSlideIcon
              key={slide._id}
              icon='slides'
              link={`/scenarios/${scenarioId}/create?slide=${slide._id}`}
              tooltipContent="Slide"
              activeSlideStems={activeSlideStems}
              activeStemId={activeStem._id}
              scenarioId={scenarioId}
              isSelected={activeStem.slideRef === slide.ref}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            layoutId={layoutId}
            transition={TRANSITION}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
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
          </motion.div>
        )}
      </AnimatePresence>
      {(isInRootStem || isNestedStem) && (
        <Flag>
          <CreateStemsContainer slideRef={slide.ref} />
        </Flag>
      )}
    </div>
  );
};

export default CreateNavigationSlide;