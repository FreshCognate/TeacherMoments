import React, { Component } from 'react';
import MediaBlockPlayer from '../components/mediaBlockPlayer';

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
    return (
      <MediaBlockPlayer
        mediaType={mediaType}
        mediaSrc={mediaSrc}
        onVideoStarted={this.onVideoStarted}
        onVideoEnded={this.onVideoEnded}
      />
    );
  }
};

export default MediaBlockPlayerContainer;