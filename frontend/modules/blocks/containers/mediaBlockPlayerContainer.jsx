import React, { Component } from 'react';
import MediaBlockPlayer from '../components/mediaBlockPlayer';
import getContent from '~/modules/ls/helpers/getContent';

class MediaBlockPlayerContainer extends Component {

  onVideoStarted = () => {
    if (this.props.block.mediaCompleteOn === 'START') {
      this.props.onUpdateTracking({ isComplete: true });
    }
  }

  onVideoEnded = () => {
    if (this.props.block.mediaCompleteOn === 'END') {
      this.props.onUpdateTracking({ isComplete: true });
    }
  }

  render() {
    const { mediaType, mediaSrc } = this.props.block;

    const mediaAsset = getContent({ model: this.props.block, field: 'mediaAsset' });

    return (
      <MediaBlockPlayer
        mediaType={mediaType}
        mediaSrc={mediaSrc}
        mediaAsset={mediaAsset}
        onVideoStarted={this.onVideoStarted}
        onVideoEnded={this.onVideoEnded}
      />
    );
  }
};

export default MediaBlockPlayerContainer;