import React from 'react';
import Options from '~/uikit/dropdowns/components/options';

const CreateNavigationSlideActions = ({
  slideNumber,
  isOptionsOpen,
  onSlideActionsToggle,
  onSlideActionClicked,
}) => {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="text-sm">
        {slideNumber}
      </div>
      <div>
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
    </div>
  );
};

export default CreateNavigationSlideActions;