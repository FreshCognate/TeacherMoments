import React, { Component } from 'react';
import AssetSelectorFormField from '../components/assetSelector.formField';
import registerField from '~/core/forms/helpers/registerField';
import getFileUploadAssepts from '../helpers/getFileUploadAssepts';
import map from 'lodash/map';
import each from 'lodash/each';
import uploadAsset from '../helpers/uploadAsset';

class AssetSelectorFormFieldContainer extends Component {

  state = {
    isUploading: false,
    acceptedFiles: [],
  }

  componentWillUnmount = () => {
    each(this.state.acceptedFiles, (acceptedFile) => URL.revokeObjectURL(acceptedFile.preview));
  }

  onDrop = (files) => {
    this.setState({
      acceptedFiles: map(files, (file) => {
        file.preview = URL.createObjectURL(file);
        file.progress = 0;
        return file;
      }),
      isUploading: true
    }, () => {

      each(files, (file, index) => {
        uploadAsset({ file }, (state, payload) => {
          if (state === 'INIT') {
            console.log(payload);
          }
          if (state === 'PROGRESS') {
            this.state.acceptedFiles[index].progress = payload.progress;
            this.setState({ acceptedFiles: this.state.acceptedFiles });
          }
          if (state === 'FINISH') {
            console.log(payload);
          }
        });
      })
    });
  }

  onDropRejected = (props) => {
    console.log('rejecting', props);
  }

  render() {

    const { fileTypes, maxFiles } = this.props.schema;

    const { acceptedFiles, isUploading } = this.state;

    return (
      <AssetSelectorFormField
        accepts={getFileUploadAssepts(fileTypes)}
        acceptedFiles={acceptedFiles}
        maxFiles={maxFiles}
        isUploading={isUploading}
        onDrop={this.onDrop}
        onDropRejected={this.onDropRejected}
      />
    );
  }
};

export default registerField('AssetSelector', AssetSelectorFormFieldContainer);