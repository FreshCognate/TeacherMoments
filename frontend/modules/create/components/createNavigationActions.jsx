import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';
import CreateNavigationSlideIcon from './createNavigationSlideIcon';
import Tooltip from '~/uikit/tooltips/components/tooltip';
import { Link } from 'react-router';
import Flag from '~/modules/flags/components/flag';

const CreateNavigationActions = ({
  scenarioId,
  activeStemSlideId,
  isCreating,
  isDuplicating,
  isInRootStem,
  isNestedStem,
  onAddSlideClicked,
  onAddStemClicked
}) => {
  return (
    <div className="flex items-center justify-between p-2 sticky top-0 z-10 bg-lm-0 dark:bg-dm-1 rounded-t-lg h-10">
      {(!isInRootStem && !isNestedStem) && (
        <Tooltip
          content="Back to parent"
          placement="right"
        >
          <Link
            to={`/scenarios/${scenarioId}/create?slide=${activeStemSlideId}`}>
            <CreateNavigationSlideIcon
              icon="home"
              isSelected={false}
            />
          </Link>
        </Tooltip>
      )}

      {(isInRootStem || isNestedStem) && (
        <>
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
          <div>
            <Flag flag="HAS_FULL_BRANCHING">
              <FlatButton isCircular isDisabled={isCreating} text="Add stem" title="Add new slide" size="sm" icon="branching" onClick={onAddStemClicked} />
            </Flag>
          </div>
        </>
      )
      }
    </div >
  );
};

export default CreateNavigationActions;