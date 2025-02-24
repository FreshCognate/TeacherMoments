import React, { Component } from 'react';
import InputPromptBlockPlayer from '../components/inputPromptBlockPlayer';
import cloneDeep from 'lodash/cloneDeep';
import includes from 'lodash/includes';
import pull from 'lodash/pull';

class InputPromptBlockPlayerContainer extends Component {

  state = {
    hasAudioLoaded: false
  }

  onTextInputChanged = (event) => {
    this.props.onUpdateTracking({ textValue: event.target.value });
  }

  onSubmitButtonClicked = () => {
    this.props.onUpdateTracking({ isComplete: true });
  }

  onAudioLoaded = () => {
    console.log('loaded');
    this.setState({ hasAudioLoaded: true });
  }

  render() {
    const { block, tracking } = this.props;
    return (
      <InputPromptBlockPlayer
        block={block}
        tracking={tracking}
        hasAudioLoaded={this.state.hasAudioLoaded}
        onTextInputChanged={this.onTextInputChanged}
        onSubmitButtonClicked={this.onSubmitButtonClicked}
        onAudioLoaded={this.onAudioLoaded}
      />
    );
  }
};

export default InputPromptBlockPlayerContainer;