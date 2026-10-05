import React from 'react';
import CreateNavigationActions from './createNavigationActions';
import classnames from 'classnames';
import CreateNavigationStemContainer from '../containers/createNavigationStemContainer';

const CreateNavigation = ({
  scenarioId,
  parentStemSlideId,
  stemName,
  isCreating,
  isInRootStem,
  onAddSlideClicked,
  onBackToParentClicked
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
          parentStemSlideId={parentStemSlideId}
          stemName={stemName}
          isCreating={isCreating}
          isInRootStem={isInRootStem}
          onAddSlideClicked={onAddSlideClicked}
          onBackToParentClicked={onBackToParentClicked}
        />
        <CreateNavigationStemContainer
          scenarioId={scenarioId}
          isInRootStem={isInRootStem}
        />
      </div>
    </div>
  );
};

export default CreateNavigation;