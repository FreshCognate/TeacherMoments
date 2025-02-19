import React, { Component } from 'react';
import AssetSelectorFormField from '../components/assetSelector.formField';
import registerField from '~/core/forms/helpers/registerField';
import getFileUploadAccepts from '../helpers/getFileUploadAccepts';
import map from 'lodash/map';
import each from 'lodash/each';
import uploadAsset from '../helpers/uploadAsset';
import getCache from '~/core/cache/helpers/getCache';

class AssetSelectorFormFieldContainer extends Component {

  state = {
    hasError: false,
    error: null,
    isUploading: false,
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
      each(files, (file, index) => {
        uploadAsset({ file }, (state, payload) => {
          if (state === 'INIT') {
            const { asset } = payload;
            this.props.updateField(asset._id);
          }
          if (state === 'PROGRESS') {
            this.state.acceptedFile.progress = payload.progress;
            this.setState({ acceptedFile: this.state.acceptedFile });
          }
          if (state === 'FINISH') {
            const block = getCache('block');
            block.fetch().then(() => {
              setTimeout(() => {
                this.setState({ isUploading: false, acceptedFile: null });
              }, 0);
            })
          }
        });
      })
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
  }

  render() {

    const { fileTypes } = this.props.schema;

    const { acceptedFile, isUploading, hasError, error } = this.state;

    return (
      <AssetSelectorFormField
        value={this.props.value}
        accepts={getFileUploadAccepts(fileTypes)}
        acceptedFile={acceptedFile}
        hasError={hasError}
        error={error}
        isUploading={isUploading}
        onDrop={this.onDrop}
        onDropRejected={this.onDropRejected}
        onRemoveAssetClicked={this.onRemoveAssetClicked}
      />
    );
  }
};

export default registerField('AssetSelector', AssetSelectorFormFieldContainer);