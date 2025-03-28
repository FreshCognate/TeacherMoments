import React, { Component } from 'react';
import AssetSelectorFormField from '../components/assetSelector.formField';
import registerField from '~/core/forms/helpers/registerField';
import getFileUploadAccepts from '../helpers/getFileUploadAccepts';
import uploadAsset from '../helpers/uploadAsset';
import getCache from '~/core/cache/helpers/getCache';
import handleRequestError from '~/core/app/helpers/handleRequestError';

class AssetSelectorFormFieldContainer extends Component {

  state = {
    hasError: false,
    error: null,
    isUploading: false,
    isProcessing: false,
    acceptedFile: null,
  }

  componentWillUnmount = () => {
    if (this.state.acceptedFile) {
      URL.revokeObjectURL(this.state.acceptedFile.preview);
    }
  }

  onDrop = (files) => {
    const acceptedFile = files[0];
    acceptedFile.preview = URL.createObjectURL(acceptedFile);
    acceptedFile.progress = 0;
    this.setState({
      hasError: false,
      error: null,
      acceptedFile,
      isUploading: true
    }, () => {
      uploadAsset({ file: files[0] }, (state, payload) => {
        switch (state) {
          case 'ASSET_UPLOADING':
            const { asset } = payload;
            this.props.updateField(asset._id);
            break;
          case 'ASSET_UPLOADING_PROGRESS':
            this.state.acceptedFile.progress = payload.progress;
            this.setState({ acceptedFile: this.state.acceptedFile });
            break;
          case 'ASSET_UPLOADED':
            setTimeout(() => {
              this.setState({ isUploading: false });
            }, 0);
            break;
          case 'IMAGES_PROCESSING':
            this.setState({ isProcessing: true });
            break;
          case 'IMAGES_PROCESSED':
            this.setState({ isProcessing: false });
            break;
          case 'ASSET_ERRORED':
            handleRequestError(payload);
            break;
        }
      });
    });
  }

  onDropRejected = (rejectedFiles) => {
    const rejectedFile = rejectedFiles[0];
    const error = rejectedFile.errors[0].message;
    this.setState({
      error: error,
      hasError: true
    })
  }

  onRemoveAssetClicked = () => {
    this.props.updateField(null);
    this.setState({ acceptedFile: null });
  }

  render() {

    const { fileTypes } = this.props.schema;

    const { acceptedFile, isUploading, isProcessing, hasError, error } = this.state;

    return (
      <AssetSelectorFormField
        value={this.props.value}
        accepts={getFileUploadAccepts(fileTypes)}
        acceptedFile={acceptedFile}
        hasError={hasError}
        error={error}
        isUploading={isUploading}
        isProcessing={isProcessing}
        onDrop={this.onDrop}
        onDropRejected={this.onDropRejected}
        onRemoveAssetClicked={this.onRemoveAssetClicked}
      />
    );
  }
};

export default registerField('AssetSelector', AssetSelectorFormFieldContainer);