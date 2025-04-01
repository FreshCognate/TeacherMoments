import React, { Component } from 'react';
import MultipleChoicePromptBlockPlayer from '../components/multipleChoicePromptBlockPlayer';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import remove from 'lodash/remove';
import getString from '~/modules/ls/helpers/getString';

class MultipleChoicePromptBlockPlayerContainer extends Component {

  onAnswerClicked = (selectedOptionId) => {
    const { selectedOptions } = this.props.blockTracking;
    const { isMultiSelect, options } = this.props.block;
    const currentOption = find(options, { _id: selectedOptionId });

    let usersSelectedOption = {
      _id: currentOption._id,
      text: getString({ model: currentOption, field: 'text' }),
      value: currentOption.value,
    }

    let clonedSelectedOptions = cloneDeep(selectedOptions);
    if (isMultiSelect) {
      if (find(clonedSelectedOptions, { _id: selectedOptionId })) {
        remove(clonedSelectedOptions, (item) => {
          if (item._id === selectedOptionId) return true;
        });
      } else {
        clonedSelectedOptions.push(usersSelectedOption);
      }
    } else {
      clonedSelectedOptions = [usersSelectedOption];
    }
    let isAbleToComplete = false;
    if (clonedSelectedOptions.length > 0) {
      isAbleToComplete = true;
    }
    this.props.onUpdateBlockTracking({ selectedOptions: clonedSelectedOptions, isAbleToComplete });
  }

  render() {
    const { block, blockTracking, isResponseBlock } = this.props;
    return (
      <MultipleChoicePromptBlockPlayer
        block={block}
        blockTracking={blockTracking}
        isResponseBlock={isResponseBlock}
        onAnswerClicked={this.onAnswerClicked}
      />
    );
  }
};

export default MultipleChoicePromptBlockPlayerContainer;