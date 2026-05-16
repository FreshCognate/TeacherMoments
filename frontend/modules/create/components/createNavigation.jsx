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
import { Link } from 'react-router';
import Icon from '~/uikit/icons/components/icon';

const CreateNavigation = ({
  scenarioId,
  slides,
  blocks,
  rootSlides,
  activeSlideId,
  isCreating,
  deletingId,
  isDuplicating,
  isInRootStem,
  onAddSlideClicked,
  onDuplicateSlideClicked,
  onDeleteSlideClicked,
  onCreateStemClicked
}) => {
  console.log("isInRootStem", isInRootStem);
  return (
    <div className="flex flex-row">

      {(!isInRootStem) && (
        <div className="bg-lm-0 dark:bg-dm-1 w-full max-w-64 h-full flex flex-col border border-lm-3 dark:border-dm-1 rounded-lg mr-1">
          <div className="p-2 overflow-y-scroll flex-grow gap-y-2 flex flex-col">
            <div>
              <Link to={`/scenarios/${scenarioId}/create?slide=CONSENT`} replace>
                <Icon icon="consent" />
              </Link>
            </div>
            {map(rootSlides, (slide) => {
              return (
                <div key={slide._id}>
                  <Link to={`/scenarios/${scenarioId}/create?slide=${slide._id}`} replace>
                    <Icon icon="slides" />
                  </Link>
                </div>
              );
            })}
            <div>
              <Link to={`/scenarios/${scenarioId}/create?slide=SUMMARY`} replace>
                <Icon icon="summary" />
              </Link>
            </div>
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
                const hasChildStems = getStemsBySlideRef({ slideRef: item.ref });

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
                  const hasChildStems = getStemsBySlideRef({ slideRef: item.ref });

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