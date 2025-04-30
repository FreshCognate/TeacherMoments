import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Body from '~/uikit/content/components/body';

const InputPromptTextBlockPlayer = ({
  block,
  blockTracking,
  isResponseBlock,
  onTextInputChanged,
}) => {
  const textValueLength = blockTracking.textValue?.length || 0;
  const requiredCharactersRemaining = Math.max(block.requiredLength - textValueLength, 0);
  return (
    <div>
      <textarea
        placeholder={getString({ model: block, field: 'placeholder' })}
        value={blockTracking.textValue}
        disabled={blockTracking.isComplete || isResponseBlock}
        className="w-full p-2 text-sm hover:border-lm-4 dark:hover:border-dm-4 focus:outline outline-2 -outline-offset-1 outline-lm-4 dark:outline-dm-4 rounded border border-lm-3 dark:border-dm-3"
        onChange={onTextInputChanged}
      />
      {(block.isRequired) && (
        <div className="flex justify-end">
          <Body
            body={`${requiredCharactersRemaining} characters required`}
            size="xs"
            className="text-black/50 dark:text-white/50"
          />
        </div>
      )}
    </div>
  );
};

export default InputPromptTextBlockPlayer;