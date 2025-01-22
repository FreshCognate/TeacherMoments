import React, { Component } from 'react';
import AnswersPromptBlockPlayer from '../components/answersPromptBlockPlayer';

class AnswersPromptBlockPlayerContainer extends Component {

  onAnswerClicked = (value) => {
    const { answerValues } = this.props.tracking;
    const { isMultiSelect } = this.props.block;
    let clonedAnswerValues = this.props.tracking.answerValues ? cloneDeep(answerValues) : [];
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
        onSubmitButtonClicked={this.onSubmitButtonClicked}
        onAnswerClicked={this.onAnswerClicked}
      />
    );
  }
};

export default AnswersPromptBlockPlayerContainer;