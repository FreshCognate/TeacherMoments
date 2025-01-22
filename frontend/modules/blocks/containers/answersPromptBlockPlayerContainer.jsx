import React, { Component } from 'react';
import AnswersPromptBlockPlayer from '../components/answersPromptBlockPlayer';
import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import pull from 'lodash/pull';

class AnswersPromptBlockPlayerContainer extends Component {

  getIsSubmitButtonDisabled = () => {
    const { answerValues, isComplete } = this.props.tracking;
    if (isComplete) return true;
    if (answerValues.length === 0) {
      return true;
    }
    return false;
  }

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
    this.props.onUpdateTracking({ answerValues: clonedAnswerValues });
  }

  onSubmitButtonClicked = () => {
    this.props.onUpdateTracking({ isComplete: true });
  }

  render() {
    const { block, tracking } = this.props;
    return (
      <AnswersPromptBlockPlayer
        block={block}
        tracking={tracking}
        isSubmitButtonDisabled={this.getIsSubmitButtonDisabled()}
        onSubmitButtonClicked={this.onSubmitButtonClicked}
        onAnswerClicked={this.onAnswerClicked}
      />
    );
  }
};

export default AnswersPromptBlockPlayerContainer;