import React, { Component } from 'react';
import PromptBlockPlayer from '../components/promptBlockPlayer';
import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import pull from 'lodash/pull';

class PromptBlockPlayerContainer extends Component {

  onTextInputChanged = (event) => {
    this.props.onUpdateTracking({ textValue: event.target.value });
  }

  onAnswerClicked = (value) => {
    const { answerValues } = this.props.tracking;
    let clonedAnswerValues = this.props.tracking.answerValues ? cloneDeep(answerValues) : [];
    if (includes(clonedAnswerValues, value)) {
      pull(clonedAnswerValues, value);
    } else {
      clonedAnswerValues.push(value);
    }
    this.props.onUpdateTracking({ answerValues: clonedAnswerValues });
  }

  onSubmitButtonClicked = () => {
    this.props.onUpdateTracking({ isComplete: true });
  }

  render() {
    const { block, tracking } = this.props;
    return (
      <PromptBlockPlayer
        block={block}
        tracking={tracking}
        onTextInputChanged={this.onTextInputChanged}
        onSubmitButtonClicked={this.onSubmitButtonClicked}
        onAnswerClicked={this.onAnswerClicked}
      />
    );
  }
};

export default PromptBlockPlayerContainer;