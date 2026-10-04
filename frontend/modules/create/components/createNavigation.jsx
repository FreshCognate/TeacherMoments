import React from 'react';
import CreateNavigationActions from './createNavigationActions';
import classnames from 'classnames';
import CreateNavigationStemContainer from '../containers/createNavigationStemContainer';

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
  onAddStemClicked,
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
          onAddStemClicked={onAddStemClicked}
        />
        <CreateNavigationStemContainer
          scenarioId={scenarioId}
          rootSlides={rootSlides}
          blocks={blocks}
          activeSlideId={activeSlideId}
          deletingId={deletingId}
          isDuplicating={isDuplicating}
          isInRootStem={isInRootStem}
          onDuplicateSlideClicked={onDuplicateSlideClicked}
          onDeleteSlideClicked={onDeleteSlideClicked}
          onCreateStemClicked={onCreateStemClicked}
        />
      </div>
    </div>
  );
};

export default CreateNavigation;