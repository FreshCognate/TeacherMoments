import React from 'react';
import Options from '~/uikit/dropdowns/components/options';

const CreateNavigationSlideActions = ({
  slideNumber,
  isOptionsOpen,
  options,
  onSlideActionsToggle,
  onSlideActionClicked,
}) => {
  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div className="text-sm">
        {slideNumber}
      </div>
      <div>
        {(options.length > 0) && (
          <Options
            options={options}
            title="Slide options"
            isOpen={isOptionsOpen}
            onToggle={onSlideActionsToggle}
            onOptionClicked={onSlideActionClicked}
          />
        )}
      </div>
    </div>
  );
};

export default CreateNavigationSlideActions;