import React from 'react';
import ValidationIndicator from '~/uikit/badges/components/validationIndicator';
import Options from '~/uikit/dropdowns/components/options';

const CreateNavigationSlideActions = ({
  slideNumber,
  isOptionsOpen,
  options,
  slideErrors,
  onSlideActionsToggle,
  onSlideActionClicked,
}) => {
  return (
    <div className="flex items-center justify-between px-2 py-1">
      <div className="text-sm">
        {slideNumber}
      </div>
      <div className="flex items-center gap-x-2">
        <ValidationIndicator errors={slideErrors} variant="inline" />
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