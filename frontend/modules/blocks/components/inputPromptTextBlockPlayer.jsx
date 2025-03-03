import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';

const InputPromptTextBlockPlayer = ({
  block,
  tracking,
  isResponseBlock,
  onTextInputChanged,
}) => {
  return (
    <div>
      <textarea
        placeholder={getString({ model: block, field: 'placeholder' })}
        value={tracking.textValue}
        disabled={tracking.isComplete || isResponseBlock}
        className="w-full p-2 text-sm hover:border-lm-4 dark:hover:border-dm-4 focus:outline outline-2 -outline-offset-1 outline-lm-4 dark:outline-dm-4 rounded border border-lm-3 dark:border-dm-3"
        onChange={onTextInputChanged}
      />
    </div>
  );
};

export default InputPromptTextBlockPlayer;