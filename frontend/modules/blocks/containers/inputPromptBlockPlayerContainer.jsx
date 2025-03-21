import React, { Component } from 'react';
import InputPromptBlockPlayer from '../components/inputPromptBlockPlayer';
import setUserPreferences from '~/modules/tracking/helpers/setUserPreferences';
import getUserPreferences from '~/modules/tracking/helpers/getUserPreferences';
import axios from 'axios';
import uploadAsset from '~/modules/assets/helpers/uploadAsset';
import handleRequestError from '~/core/app/helpers/handleRequestError';

class InputPromptBlockPlayerContainer extends Component {

  state = {
    isUploadingAudio: false,
    uploadProgress: 0,
    uploadAssetId: null
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
    let isAbleToComplete = false;
    if (event.target.value.length >= this.props.block.requiredLength) {
      isAbleToComplete = true;
    }
    this.props.onUpdateTracking({ textValue: event.target.value, isAbleToComplete });
  }

  onAudioRecorded = (mediaBlobUrl) => {
    this.setState({ isUploadingAudio: true });

    const file = new File([mediaBlobUrl], "audio-recording", { type: 'audio/mpeg' });

    uploadAsset({ file }, async (state, payload) => {
      if (state === 'INIT') {
        const { asset } = payload;
        this.setState({ uploadAssetId: asset._id })
      }
      if (state === 'PROGRESS') {
        this.setState({ uploadProgress: payload.progress });
      }
      if (state === 'FINISH') {
        const { data } = await axios.get(`/api/assets/${this.state.uploadAssetId}`);
        this.props.onUpdateTracking({ audio: data.asset, isComplete: true, isAbleToComplete: true });
        this.setState({ isUploadingAudio: false });
      }
      if (state === 'ERROR') {
        handleRequestError(error);
      }
    });
  }

  onPermissionDenied = () => {
    setUserPreferences({ isAudioDisabled: true });
  }

  render() {
    const { block, tracking, isResponseBlock } = this.props;
    const { isUploadingAudio, uploadProgress } = this.state;
    const { isAudioDisabled } = getUserPreferences();
    return (
      <InputPromptBlockPlayer
        block={block}
        tracking={tracking}
        isAudioDisabled={isAudioDisabled}
        isResponseBlock={isResponseBlock}
        isUploadingAudio={isUploadingAudio}
        uploadProgress={uploadProgress}
        onTextInputChanged={this.onTextInputChanged}
        onAudioRecorded={this.onAudioRecorded}
        onPermissionDenied={this.onPermissionDenied}
      />
    );
  }
};

export default InputPromptBlockPlayerContainer;