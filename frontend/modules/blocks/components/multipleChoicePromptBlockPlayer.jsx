import React from 'react';
import getString from '~/modules/ls/helpers/getString';
import Body from '~/uikit/content/components/body';
import map from 'lodash/map';
import find from 'lodash/find';
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
        <Body body={getString({ model: block, field: 'body' })} />
        <div className="absolute -top-3 right-0">
          <Required isRequired={block.isRequired} isComplete={blockTracking.isAbleToComplete} />
        </div>
      </div>

      <div className="mb-2">
        {map(block.options, (option) => {
          const isSelected = !!find(blockTracking.selectedOptions, { _id: option._id });
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