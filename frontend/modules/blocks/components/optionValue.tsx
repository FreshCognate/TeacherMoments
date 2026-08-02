import React from 'react';
import FlatButton from '~/uikit/buttons/components/flatButton';

const OptionValue = ({
  value,
  isDisabled,
  updateField
}: {
  value: string;
  isDisabled: boolean;
  updateField: (value: string) => void;
}) => {
  return (
    <div>
      <div>
        <input
          type='text'
          value={value}
          disabled={isDisabled}
          className="py-3 px-3 text-sm text-black/80 dark:text-white/80 bg-lm-4/50 dark:bg-dm-4/50 rounded w-full focus:outline-2 outline-lm-4 dark:outline-dm-4 outline-offset-2 disabled:text-black/40 disabled:dark:text-white/40"
          onChange={(event) => updateField(event.target.value)}
        />
      </div>
      <div className="flex items-center justify-end gap-x-2">
        <FlatButton text="Edit" size="sm" />
        <FlatButton text="Remove" size="sm" />
      </div>
    </div>
  );
};

export default OptionValue;