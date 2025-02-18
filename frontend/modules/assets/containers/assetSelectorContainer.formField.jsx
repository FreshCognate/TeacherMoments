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
            const { asset } = payload;
            this.props.updateField(asset._id);
          }
          if (state === 'PROGRESS') {
            this.state.acceptedFiles[index].progress = payload.progress;
            this.setState({ acceptedFiles: this.state.acceptedFiles });
          }
          if (state === 'FINISH') {
            const block = getCache('block');
            block.fetch().then(() => {
              setTimeout(() => {
                this.setState({ isUploading: false, acceptedFiles: [] });
              }, 0);
            })
          }
        });
      })
    });
  }

  onDropRejected = (props) => {
    console.log('rejecting', props);
  }

  onRemoveAssetClicked = () => {
    this.props.updateField(null);
  }

  render() {

    const { fileTypes, maxFiles } = this.props.schema;

    const { acceptedFiles, isUploading } = this.state;

    console.log(acceptedFiles, isUploading);

    return (
      <AssetSelectorFormField
        value={this.props.value}
        accepts={getFileUploadAccepts(fileTypes)}
        acceptedFiles={acceptedFiles}
        maxFiles={maxFiles}
        isUploading={isUploading}
        onDrop={this.onDrop}
        onDropRejected={this.onDropRejected}
        onRemoveAssetClicked={this.onRemoveAssetClicked}
      />
    );
  }
};

export default registerField('AssetSelector', AssetSelectorFormFieldContainer);