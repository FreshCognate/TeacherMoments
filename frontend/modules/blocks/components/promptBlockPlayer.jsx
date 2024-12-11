import React from 'react';
import getString from '~/modules/ls/helpers/getString'; import Body from '~/uikit/content/components/body';
;

const PromptBlockPlayer = ({
  block
}) => {
  return (
    <div>
      <div className="mb-2">
        <Body body={getString({ model: block, field: 'body' })} />
      </div>
      {(block.promptType === 'TEXT') && (
        <textarea
          placeholder={getString({ model: block, field: 'placeholder' })}
          className="w-full p-2 text-sm hover:border-lm-4 dark:hover:border-dm-4 focus:outline outline-2 -outline-offset-1 outline-lm-4 dark:outline-dm-4 rounded border border-lm-3 dark:border-dm-3"
        >

        </textarea>
      )}
    </div>
  );
};

export default PromptBlockPlayer;