import React, { Component } from 'react';
import MultipleChoicePromptBlockPlayer from '../components/multipleChoicePromptBlockPlayer';
import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import pull from 'lodash/pull';

class MultipleChoicePromptBlockPlayerContainer extends Component {

  onAnswerClicked = (value) => {
    const { answerValues } = this.props.tracking;
    const { isMultiSelect } = this.props.block;
    let clonedAnswerValues = cloneDeep(answerValues);
    if (isMultiSelect) {
      if (includes(clonedAnswerValues, value)) {
        pull(clonedAnswerValues, value);
      } else {
        clonedAnswerValues.push(value);
      }
    } else {
      clonedAnswerValues = [value];
    }
    let isAbleToComplete = false;
    if (clonedAnswerValues.length > 0) {
      isAbleToComplete = true;
    }
    this.props.onUpdateTracking({ answerValues: clonedAnswerValues, isAbleToComplete });
  }

  render() {
    const { block, tracking, isResponseBlock } = this.props;
    return (
      <MultipleChoicePromptBlockPlayer
        block={block}
        tracking={tracking}
        isResponseBlock={isResponseBlock}
        onAnswerClicked={this.onAnswerClicked}
      />
    );
  }
};

export default MultipleChoicePromptBlockPlayerContainer;