import React from 'react';
import classnames from 'classnames';
import getString from '~/modules/ls/helpers/getString';
import Body from '~/uikit/content/components/body';

const MultipleChoicePromptBlockPlayerAnswer = ({
  option,
  isMultiSelect,
  isSelected,
  isComplete,
  isResponseBlock,
  onAnswerClicked
}) => {
  const inputType = isMultiSelect ? 'checkbox' : 'radio';
  const isDisabled = isComplete || isResponseBlock;

  return (
    <label
      key={option._id}
      className={classnames("flex items-center bg-lm-3/60 dark:bg-dm-3/60 rounded-md mb-2 -outline-offset-2 outline outline-2 outline-transparent",
        "border-2 border-lm-2 dark:border-dm-2 p-4",
        "last:mb-0",
        {
          "cursor-pointer": !isDisabled,
          "pointer-events-none": isDisabled,
          "outline-2 hover:outline-lm-3 dark:hover:outline-dm-3": !isSelected && !isDisabled,
          "outline-2  outline-primary-regular dark:outline-primary-light": isSelected,
        }
      )}
    >
      <div className="mr-4">
        <input
          type={inputType}
          disabled={isDisabled}
          checked={isSelected}
          className=" accent-primary-regular dark:accent-primary-light disabled:accent-primary-regular dark:disabled:accent-primary-light"
          onChange={() => onAnswerClicked(option._id)} />
      </div>
      <div>
        <Body body={getString({ model: option, field: "text" })} />
      </div>
    </label>
  );
};

export default MultipleChoicePromptBlockPlayerAnswer;