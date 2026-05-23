import React from 'react';
import CreateNavigationActions from './createNavigationActions';
import CreateNavigationSlide from './createNavigationSlide';
import CreateNavigationStaticSlide from './createNavigationStaticSlide';
import CreateDroppableContainer from '../containers/createDroppableContainer';
import filter from 'lodash/filter';
import Flag from '~/modules/flags/components/flag';
import getTriggersBySlideRef from '~/modules/triggers/helpers/getTriggersBySlideRef';
import getStemsBySlideRef from '~/modules/stems/helpers/getStemsBySlideRef';
import map from 'lodash/map';
import classnames from 'classnames';
import CreateNavigationSlideIcon from './createNavigationSlideIcon';
import { AnimatePresence, motion } from 'framer-motion';

const CreateNavigation = ({
  scenarioId,
  slides,
  blocks,
  rootSlides,
  activeSlideId,
  activeStemSlideId,
  activeStem,
  activeSlideStems,
  isCreating,
  deletingId,
  isDuplicating,
  isInRootStem,
  onAddSlideClicked,
  onDuplicateSlideClicked,
  onDeleteSlideClicked,
  onCreateStemClicked
}) => {
  return (
    <div className="flex flex-row relative" style={{ minWidth: isInRootStem ? '256px' : '320px' }}>
      <div className={classnames("max-w-64 h-full flex flex-col relative z-10 transition-all",
        "bg-lm-0 dark:bg-dm-1 ",
        "border border-lm-3 dark:border-dm-1 rounded-lg",
        "w-full")}
        style={{ width: isInRootStem ? '256px' : '50px' }}
      >
        <CreateNavigationActions
          scenarioId={scenarioId}
          activeStemSlideId={activeStemSlideId}
          isCreating={isCreating}
          isDuplicating={isDuplicating}
          isInRootStem={isInRootStem}
          isNestedStem={false}
          onAddSlideClicked={onAddSlideClicked}
        />
        <div className="p-2 overflow-y-scroll flex-grow">
          <CreateNavigationStaticSlide
            label="Consent"
            slideId="CONSENT"
            icon="consent"
            scenarioId={scenarioId}
            isSelected={activeSlideId === 'CONSENT'}
            isInRootStem={isInRootStem}
          />
          <CreateDroppableContainer
            id={`slides`}
            items={rootSlides}
            data={{
              type: 'SLIDES'
            }}
            renderItem={({ item, index, items, draggingOptions }) => {

              const canDeleteSlides = items.length > 1;
              let isSelected = false;
              let isDeletingSlide = false;
              if (item._id === activeSlideId) isSelected = true;
              if (item._id === deletingId) isDeletingSlide = true;
              const slideBlocks = filter(blocks, { slideRef: item.ref });

              const slideTriggers = getTriggersBySlideRef({ slideRef: item.ref });
              const hasChildStems = getStemsBySlideRef({ slideRef: item.ref }).length > 0;

              return (
                <CreateNavigationSlide
                  key={item._id}
                  scenarioId={scenarioId}
                  slide={item}
                  slideBlocks={slideBlocks}
                  slideTriggers={slideTriggers}
                  activeStem={activeStem}
                  activeSlideStems={activeSlideStems}
                  draggingOptions={draggingOptions}
                  isSelected={isSelected}
                  isDeleting={isDeletingSlide}
                  isDuplicating={isDuplicating}
                  isInRootStem={isInRootStem}
                  isNestedStem={false}
                  canDeleteSlides={canDeleteSlides}
                  hasChildStems={hasChildStems}
                  onDuplicateSlideClicked={onDuplicateSlideClicked}
                  onDeleteSlideClicked={onDeleteSlideClicked}
                  onCreateStemClicked={onCreateStemClicked}
                />
              );

            }}
          />
          <CreateNavigationStaticSlide
            label="Summary"
            slideId="SUMMARY"
            icon="summary"
            scenarioId={scenarioId}
            isSelected={activeSlideId === 'SUMMARY'}
            isInRootStem={isInRootStem}
          />
        </div>
      </div>
      {(!isInRootStem) && (
        <motion.div
          key="nested-panel"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute left-16 bg-lm-0 dark:bg-dm-1 w-full max-w-64 h-full flex flex-col border border-lm-3 dark:border-dm-1 rounded-lg"
        >
          <CreateNavigationActions isCreating={isCreating} isDuplicating={isDuplicating} isInRootStem={isInRootStem} isNestedStem={true} onAddSlideClicked={onAddSlideClicked} />
          <div className="p-2 overflow-y-scroll flex-grow">
            <Flag flag="HAS_STEMS">
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
                  if (item._id === activeSlideId) isSelected = true;
                  if (item._id === deletingId) isDeletingSlide = true;
                  const slideBlocks = filter(blocks, { slideRef: item.ref });

                  const slideTriggers = getTriggersBySlideRef({ slideRef: item.ref });
                  const hasChildStems = getStemsBySlideRef({ slideRef: item.ref }).length > 0;

                  return (
                    <CreateNavigationSlide
                      key={item._id}
                      scenarioId={scenarioId}
                      slide={item}
                      slideBlocks={slideBlocks}
                      slideTriggers={slideTriggers}
                      draggingOptions={draggingOptions}
                      isSelected={isSelected}
                      isDeleting={isDeletingSlide}
                      isDuplicating={isDuplicating}
                      isInRootStem={isInRootStem}
                      isNestedStem={true}
                      canDeleteSlides={canDeleteSlides}
                      hasChildStems={hasChildStems}
                      onDuplicateSlideClicked={onDuplicateSlideClicked}
                      onDeleteSlideClicked={onDeleteSlideClicked}
                      onCreateStemClicked={onCreateStemClicked}
                    />
                  );

                }}
              />
            </Flag>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CreateNavigation;