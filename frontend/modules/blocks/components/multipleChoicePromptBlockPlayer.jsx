import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Body from '~/uikit/content/components/body';
import map from 'lodash/map';
import includes from 'lodash/includes';
import MultipleChoicePromptBlockPlayerAnswer from './multipleChoicePromptBlockPlayerAnswer';
import Required from '~/uikit/alerts/components/required';

const MultipleChoicePromptBlockPlayer = ({
  block,
  blockTracking,
  isResponseBlock,
  onAnswerClicked
}) => {
  return (
    <div>

      <div className="mb-2 relative">
        <div className="flex mb-2">
          <Required isRequired={block.isRequired} isComplete={blockTracking.isAbleToComplete} />
        </div>
        <Body body={getString({ model: block, field: 'body' })} />
      </div>

      <div className="mb-2">
        {map(block.options, (option) => {
          const isSelected = !!includes(blockTracking.selectedOptions, option.value);
          return (
            <MultipleChoicePromptBlockPlayerAnswer
              key={option._id}
              option={option}
              isMultiSelect={block.isMultiSelect}
              isSelected={isSelected}
              isComplete={blockTracking.isComplete}
              isResponseBlock={isResponseBlock}
              onAnswerClicked={onAnswerClicked}
            />
          );
        })}
      </div>

    </div >
  );
};

export default MultipleChoicePromptBlockPlayer;