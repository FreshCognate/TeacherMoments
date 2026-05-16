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
import CreateNavigationIconSlide from './createNavigationIconSlide';

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
    <div className="flex flex-row">

      {(!isInRootStem) && (
        <div className="bg-lm-0 dark:bg-dm-1 w-full max-w-64 h-full flex flex-col border border-lm-3 dark:border-dm-1 rounded-lg mr-1">
          <div className="px-2 pt-2">
            <CreateNavigationIconSlide
              icon='home'
              link={`/scenarios/${scenarioId}/create?slide=${activeStemSlideId}`}
              isSelected={false}
              tooltipContent="Back to main path"
            />
          </div>
          <div className="p-2 overflow-y-scroll flex-grow gap-y-2 flex flex-col">
            <CreateNavigationIconSlide
              icon='consent'
              link={`/scenarios/${scenarioId}/create?slide=CONSENT`}
              isSelected={false}
              tooltipContent="Consent slide"
            />
            {map(rootSlides, (slide) => {
              return (
                <CreateNavigationIconSlide
                  key={slide._id}
                  icon='slides'
                  link={`/scenarios/${scenarioId}/create?slide=${slide._id}`}
                  tooltipContent="Slide"
                  activeSlideStems={activeSlideStems}
                  activeStemId={activeStem._id}
                  scenarioId={scenarioId}
                  isSelected={activeStem.slideRef === slide.ref}
                />
              );
            })}
            <CreateNavigationIconSlide
              icon='summary'
              link={`/scenarios/${scenarioId}/create?slide=SUMMARY`}
              isSelected={false}
              tooltipContent="Summary slide"
            />
          </div>
        </div>
      )}
      {(isInRootStem) && (
        <div className="bg-lm-0 dark:bg-dm-1 w-full max-w-64 h-full flex flex-col border border-lm-3 dark:border-dm-1 rounded-lg">
          <CreateNavigationActions isCreating={isCreating} isDuplicating={isDuplicating} onAddSlideClicked={onAddSlideClicked} />
          <div className="p-2 overflow-y-scroll flex-grow">
            <CreateNavigationStaticSlide
              label="Consent"
              slideId="CONSENT"
              icon="consent"
              scenarioId={scenarioId}
              isSelected={activeSlideId === 'CONSENT'}
            />
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
            />
          </div>
        </div>
      )}
      {(!isInRootStem) && (
        <div className="bg-lm-0 dark:bg-dm-1 w-full max-w-64 h-full flex flex-col border border-lm-3 dark:border-dm-1 rounded-lg">
          <CreateNavigationActions isCreating={isCreating} isDuplicating={isDuplicating} onAddSlideClicked={onAddSlideClicked} />
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
        </div>
      )}
    </div>
  );
};

export default CreateNavigation;