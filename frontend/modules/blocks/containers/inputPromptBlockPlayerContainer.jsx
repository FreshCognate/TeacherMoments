import React, { Component } from 'react';
import InputPromptBlockPlayer from '../components/inputPromptBlockPlayer';
import setUserPreferences from '~/modules/run/helpers/setUserPreferences';
import getUserPreferences from '~/modules/run/helpers/getUserPreferences';
import axios from 'axios';
import uploadAsset from '~/modules/assets/helpers/uploadAsset';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import isScenarioInPlay from '~/modules/scenarios/helpers/isScenarioInPlay';
import { v4 as uuidv4 } from 'uuid';

class InputPromptBlockPlayerContainer extends Component {

  state = {
    isUploadingAudio: false,
    isTranscribing: false,
    uploadProgress: 0,
    uploadAssetId: null,
    uploadStatus: ''
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
    this.props.onUpdateBlockTracking({ textValue: event.target.value, isAbleToComplete });
  }

  onAudioRecorded = async (mediaBlobUrl) => {
    this.setState({ isUploadingAudio: true });

    const response = await fetch(mediaBlobUrl);
    const blob = await response.blob();

    const file = new File([blob], `${uuidv4()}.wav`, { type: blob.type });

    uploadAsset({ file, isTemporary: !isScenarioInPlay() }, async (state, payload) => {
      switch (state) {
        case 'ASSET_UPLOADING':
          const { asset } = payload;
          this.setState({ uploadAssetId: asset._id, uploadStatus: 'Uploading asset' })
          break;
        case 'ASSET_UPLOADING_PROGRESS':
          this.setState({ uploadProgress: payload.progress });
          break;
        case 'ASSET_UPLOADED':
          this.setState({ uploadProgress: 100, isUploadingAudio: false });
          break;
        case 'AUDIO_PROCESSING':
          this.setState({ uploadStatus: 'Converting audio' });
          break;
        case 'AUDIO_PROCESSED':
          const assetProcessedResponse = await axios.get(`/api/assets/${this.state.uploadAssetId}`);
          this.props.onUpdateBlockTracking({ audio: assetProcessedResponse.data.asset, isTranscribingAudio: true });
          break;
        case 'TRANSCRIPT_PROCESSING':
          this.setState({ uploadStatus: 'Creating transcript' });
          break;
        case 'TRANSCRIPT_PROCESSED':
          const assetTranscribedResponse = await axios.get(`/api/assets/${this.state.uploadAssetId}`);
          const isAbleToComplete = assetTranscribedResponse.data.asset.transcript.length > 0;
          this.props.onUpdateBlockTracking({ audio: assetTranscribedResponse.data.asset, isAbleToComplete });
          this.setState({ uploadStatus: null, isTranscribingAudio: false });
          break;
        case 'ASSET_ERRORED':
          handleRequestError(payload);
          break;
      }
    });
  }

  onAudioRecording = () => {
    if (this.props.blockTracking.audio) {
      if (this.props.blockTracking.audio._id) {
        axios.delete(`/api/assets/${this.props.blockTracking.audio._id}`);
      }
      this.props.onUpdateBlockTracking({ audio: null, isComplete: false, isAbleToComplete: false });
    }
  }

  onPermissionDenied = () => {
    setUserPreferences({ isAudioDisabled: true });
  }

  onRemoveAudioClicked = () => {
    if (this.props.blockTracking.audio._id) {
      axios.delete(`/api/assets/${this.props.blockTracking.audio._id}`);
    }
    this.props.onUpdateBlockTracking({ audio: null, isComplete: false, isAbleToComplete: false });
  }

  render() {
    const { block, blockTracking, isResponseBlock } = this.props;
    const { isUploadingAudio, isTranscribingAudio, uploadProgress, uploadStatus } = this.state;
    const { isAudioDisabled } = getUserPreferences();
    return (
      <InputPromptBlockPlayer
        block={block}
        blockTracking={blockTracking}
        isAudioDisabled={isAudioDisabled}
        isResponseBlock={isResponseBlock}
        isUploadingAudio={isUploadingAudio}
        isTranscribingAudio={isTranscribingAudio}
        uploadProgress={uploadProgress}
        uploadStatus={uploadStatus}
        onTextInputChanged={this.onTextInputChanged}
        onAudioRecorded={this.onAudioRecorded}
        onPermissionDenied={this.onPermissionDenied}
        onRemoveAudioClicked={this.onRemoveAudioClicked}
        onAudioRecording={this.onAudioRecording}
      />
    );
  }
};

export default InputPromptBlockPlayerContainer;