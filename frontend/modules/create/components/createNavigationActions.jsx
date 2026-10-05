import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';
import CreateNavigationSlideIcon from './createNavigationSlideIcon';
import Tooltip from '~/uikit/tooltips/components/tooltip';
import { Link } from 'react-router';
import Flag from '~/modules/flags/components/flag';
import Icon from '~/uikit/icons/components/icon';

const CreateNavigationActions = ({
  scenarioId,
  parentStemSlideId,
  isCreating,
  isDuplicating,
  isInRootStem,
  onAddSlideClicked,
  onBackToParentClicked,
}) => {
  return (
    <div className="flex items-center justify-between p-2 sticky top-0 z-10 bg-lm-0 dark:bg-dm-1 rounded-t-lg h-10">
      <div className="flex items-center opacity-60">
        {(!isInRootStem) && (
          <>
            <Tooltip
              content="Back to parent"
              placement="right"
            >
              <Link
                to={`/scenarios/${scenarioId}/create?slide=${parentStemSlideId}`}
                onClick={() => onBackToParentClicked({ parentStemSlideId })}>
                <CreateNavigationSlideIcon
                  icon="back"
                  isSelected={false}
                />
              </Link>
            </Tooltip>
            <div className="mr-2">
              <Icon icon="chevronRight" size={12} />
            </div>
            <div>
              <Body body="Stem 1" size="sm" />
            </div>
          </>
        )}
      </div>
      <div className="relative">
        {(!isCreating && !isDuplicating) && (
          <FlatButton isCircular isDisabled={isCreating} text="Add slide" title="Add new slide" size="sm" icon="slides" onClick={onAddSlideClicked} />
        )}
        {(isCreating) && (
          <Body body="Creating slide..." size="xs" className="text-black/60 dark:text-white/60" />
        )}
        {(isDuplicating) && (
          <Body body="Duplicating slide..." size="xs" className="text-black/60 dark:text-white/60" />
        )}
      </div>
    </div >
  );
};

export default CreateNavigationActions;