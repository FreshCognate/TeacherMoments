import React, { Component } from 'react';
import AnswersPromptBlockPlayer from '../components/answersPromptBlockPlayer';
import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import pull from 'lodash/pull';

class AnswersPromptBlockPlayerContainer extends Component {

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
      <AnswersPromptBlockPlayer
        block={block}
        tracking={tracking}
        isResponseBlock={isResponseBlock}
        onAnswerClicked={this.onAnswerClicked}
      />
    );
  }
};

export default AnswersPromptBlockPlayerContainer;