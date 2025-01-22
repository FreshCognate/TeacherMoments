import React from 'react';
import getString from '~/modules/ls/helpers/getString'; import Button from '~/uikit/buttons/components/button';
import Body from '~/uikit/content/components/body';
import map from 'lodash/map';
import includes from 'lodash/includes';
import PromptBlockAnswer from './promptBlockAnswer';

const PromptBlockPlayer = ({
  block,
  tracking,
  onSubmitButtonClicked,
  onTextInputChanged,
  onAnswerClicked
}) => {
  return (
    <div>
      <div className="mb-2">
        <Body body={getString({ model: block, field: 'body' })} />
      </div>

      <div className="mb-2">
        {map(block.items, (item) => {
          const isSelected = includes(tracking.answerValues || [], item.value);
          return (
            <PromptBlockAnswer
              key={item._id}
              item={item}
              isMultiSelect={block.isMultiSelect}
              isSelected={isSelected}
              isComplete={tracking.isComplete}
              onAnswerClicked={onAnswerClicked}
            />
          );
        })}
      </div>

      <textarea
        placeholder={getString({ model: block, field: 'placeholder' })}
        value={tracking.textValue}
        disabled={tracking.isComplete}
        className="w-full p-2 text-sm hover:border-lm-4 dark:hover:border-dm-4 focus:outline outline-2 -outline-offset-1 outline-lm-4 dark:outline-dm-4 rounded border border-lm-3 dark:border-dm-3"
        onChange={onTextInputChanged}
      />

      <div>
        <Button isDisabled={tracking.isComplete} text="Submit" color="primary" onClick={onSubmitButtonClicked} />
      </div>
    </div >
  );
};

export default PromptBlockPlayer;