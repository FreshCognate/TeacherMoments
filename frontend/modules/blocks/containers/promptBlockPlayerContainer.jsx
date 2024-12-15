import React, { Component } from 'react';
import PromptBlockPlayer from '../components/promptBlockPlayer';

class PromptBlockPlayerContainer extends Component {

  onTextInputChanged = (event) => {
    this.props.onUpdateTracking({ textValue: event.target.value });
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
      />
    );
  }
};

export default PromptBlockPlayerContainer;