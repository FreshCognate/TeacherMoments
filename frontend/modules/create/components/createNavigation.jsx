import React from 'react';
import CreateNavigationActions from './createNavigationActions';
import classnames from 'classnames';
import CreateNavigationStemContainer from '../containers/createNavigationStemContainer';

const CreateNavigation = ({
  scenarioId,
  stemSlides,
  blocks,
  activeSlideId,
  activeStem,
  isCreating,
  deletingId,
  isInRootStem,
  isDuplicating,
  onAddSlideClicked,
  onAddStemClicked,
  onDuplicateSlideClicked,
  onDeleteSlideClicked,
  onCreateStemClicked
}) => {
  return (
    <div className="flex flex-row relative" style={{ minWidth: '256px' }}>
      <div className={classnames("max-w-64 h-full flex flex-col relative z-10 transition-all",
        "bg-lm-0 dark:bg-dm-1 ",
        "border border-lm-3 dark:border-dm-1 rounded-lg",
        "w-full")}
        style={{ width: '256px' }}
      >
        <CreateNavigationActions
          scenarioId={scenarioId}
          isCreating={isCreating}
          isDuplicating={isDuplicating}
          isInRootStem={isInRootStem}
          isNestedStem={false}
          onAddSlideClicked={onAddSlideClicked}
          onAddStemClicked={onAddStemClicked}
        />
        <CreateNavigationStemContainer
          scenarioId={scenarioId}
          stemSlides={stemSlides}
          blocks={blocks}
          activeSlideId={activeSlideId}
          activeStem={activeStem}
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