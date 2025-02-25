import React, { Component } from 'react';
import InputPromptBlockPlayer from '../components/inputPromptBlockPlayer';
import setUserPreferences from '~/modules/tracking/helpers/setUserPreferences';
import getUserPreferences from '~/modules/tracking/helpers/getUserPreferences';

class InputPromptBlockPlayerContainer extends Component {

  state = {
    hasAudioLoaded: false
  }

  componentDidMount = async () => {
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({ name: 'microphone' });
      if (permission.state === 'denied') {
        setUserPreferences({ isAudioDisabled: true });
      }
    }
  }

  onTextInputChanged = (event) => {
    this.props.onUpdateTracking({ textValue: event.target.value });
  }

  onSubmitButtonClicked = () => {
    this.props.onUpdateTracking({ isComplete: true });
  }

  onAudioLoaded = () => {
    this.setState({ hasAudioLoaded: true });
  }

  onAudioRecorded = () => {
    this.props.onUpdateTracking({ isComplete: true });
  }

  onPermissionDenied = () => {
    setUserPreferences({ isAudioDisabled: true });
  }

  render() {
    const { block, tracking } = this.props;
    const { isAudioDisabled } = getUserPreferences();
    return (
      <InputPromptBlockPlayer
        block={block}
        tracking={tracking}
        hasAudioLoaded={this.state.hasAudioLoaded}
        isAudioDisabled={isAudioDisabled}
        onTextInputChanged={this.onTextInputChanged}
        onSubmitButtonClicked={this.onSubmitButtonClicked}
        onAudioLoaded={this.onAudioLoaded}
        onAudioRecorded={this.onAudioRecorded}
        onPermissionDenied={this.onPermissionDenied}
      />
    );
  }
};

export default InputPromptBlockPlayerContainer;