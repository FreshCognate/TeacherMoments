import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';
import Body from '~/uikit/content/components/body';

const CreateNavigationActions = ({
  isCreating,
  onAddSlideClicked
}) => {
  return (
    <div className="flex items-center p-2 sticky top-0 z-10 bg-lm-1 dark:bg-dm-1">
      <FlatButton isCircular isDisabled={isCreating} title="Add new slide" icon="create" onClick={onAddSlideClicked} />
      {(isCreating) && (
        <Body body="Creating slide..." size="xs" className="ml-2 text-black/60 dark:text-white/60" />
      )}
    </div>
  );
};

export default CreateNavigationActions;