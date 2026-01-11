import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';

const CreateNavigationActions = ({
  isCreating,
  isDuplicating,
  onAddSlideClicked
}) => {
  return (
    <div className="flex items-center justify-between p-2 sticky top-0 z-10 bg-lm-0 dark:bg-dm-1 overflow-hidden rounded-t-lg">
      <FlatButton isCircular isDisabled={isCreating} text="Add slide" title="Add new slide" icon="create" onClick={onAddSlideClicked} />
      {(isCreating) && (
        <Body body="Creating slide..." size="xs" className="ml-2 text-black/60 dark:text-white/60" />
      )}
      {(isDuplicating) && (
        <Body body="Duplicating slide..." size="xs" className="ml-2 text-black/60 dark:text-white/60" />
      )}
    </div>
  );
};

export default CreateNavigationActions;