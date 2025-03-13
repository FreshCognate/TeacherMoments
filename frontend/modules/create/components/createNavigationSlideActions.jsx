import React from 'react';
import Options from '~/uikit/dropdowns/components/options';

const CreateNavigationSlideActions = ({
  isOptionsOpen,
  onSlideActionsToggle,
  onSlideActionClicked,
}) => {
  return (
    <div className="flex justify-end p-2">
      <Options
        options={[{
          icon: 'delete',
          text: 'Delete slide',
          color: 'warning',
          action: 'DELETE'
        }]}
        isOpen={isOptionsOpen}
        onToggle={onSlideActionsToggle}
        onOptionClicked={onSlideActionClicked}
      />
    </div>
  );
};

export default CreateNavigationSlideActions;