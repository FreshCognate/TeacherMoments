import React from 'react';
import getString from '~/modules/ls/helpers/getString'; import Button from '~/uikit/buttons/components/button';
import Body from '~/uikit/content/components/body';
import map from 'lodash/map';
import includes from 'lodash/includes';
import classnames from 'classnames';

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
      {(block.promptType === 'ANSWERS') && (
        <div className="mb-2">
          {map(block.items, (item) => {
            const isSelected = includes(tracking.answerValues || [], item.value);
            return (
              <div
                key={item._id}
                className={classnames("border-2 border-lm-2 dark:border-dm-2 py-4 px-4 rounded-md mb-2 last:mb-0",
                  {
                    "border-primary-regular dark:border-primary-light": isSelected
                  }
                )}
                onClick={() => onAnswerClicked(item.value)}
              >
                <div>
                  <Body body={getString({ model: item, field: "text" })} />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {
        (block.promptType === 'TEXT') && (
          <textarea
            placeholder={getString({ model: block, field: 'placeholder' })}
            value={tracking.textValue}
            disabled={tracking.isComplete}
            className="w-full p-2 text-sm hover:border-lm-4 dark:hover:border-dm-4 focus:outline outline-2 -outline-offset-1 outline-lm-4 dark:outline-dm-4 rounded border border-lm-3 dark:border-dm-3"
            onChange={onTextInputChanged}
          />
        )
      }
      <div>
        <Button isDisabled={tracking.isComplete} text="Submit" color="primary" onClick={onSubmitButtonClicked} />
      </div>
    </div >
  );
};

export default PromptBlockPlayer;