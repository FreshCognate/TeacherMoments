import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Button from '~/uikit/buttons/components/button';
import Body from '~/uikit/content/components/body';
import map from 'lodash/map';
import includes from 'lodash/includes';
import AnswersPromptBlockPlayerAnswer from './answersPromptBlockPlayerAnswer';

const AnswersPromptBlockPlayer = ({
  block,
  tracking,
  isSubmitButtonDisabled,
  isResponseBlock,
  onSubmitButtonClicked,
  onAnswerClicked
}) => {
  return (
    <div>

      <div className="mb-2">
        <Body body={getString({ model: block, field: 'body' })} />
      </div>

      <div className="mb-2">
        {map(block.options, (option) => {
          const isSelected = includes(tracking.answerValues, option.value);
          return (
            <AnswersPromptBlockPlayerAnswer
              key={option._id}
              option={option}
              isMultiSelect={block.isMultiSelect}
              isSelected={isSelected}
              isComplete={tracking.isComplete}
              isResponseBlock={isResponseBlock}
              onAnswerClicked={onAnswerClicked}
            />
          );
        })}
      </div>

      <div>
        <Button isDisabled={isSubmitButtonDisabled} text="Submit" color="primary" onClick={onSubmitButtonClicked} />
      </div>

    </div >
  );
};

export default AnswersPromptBlockPlayer;