import React, { Component } from 'react';
import MediaBlockPlayer from '../components/mediaBlockPlayer';
import getContent from '~/modules/ls/helpers/getContent';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';

class MediaBlockPlayerContainer extends Component {

  state = {
    isReady: false
  }

  componentDidUpdate(prevProps) {
    const prevMediaUrl = this.getMediaUrl(prevProps.block);
    const currentMediaUrl = this.getMediaUrl(this.props.block);

    if (prevMediaUrl !== currentMediaUrl) {
      this.setState({ isReady: false });
    }
  }

  getMediaUrl = (block) => {
    const { mediaType, mediaSrc } = block;
    const mediaAsset = getContent({ model: block, field: 'mediaAsset' });

    if (mediaType === 'YOUTUBE') {
      return mediaSrc;
    }

    if (mediaType === 'ASSET' && mediaAsset) {
      return getAssetUrl(mediaAsset, 'original');
    }

    return null;
  }

  onVideoReady = () => {
    this.setState({ isReady: true });
  }

  onVideoStarted = () => {
    if (this.props.block.mediaCompleteOn === 'START') {
      this.props.onUpdateBlockTracking({ isComplete: true });
    }
  }

  onVideoEnded = () => {
    if (this.props.block.mediaCompleteOn === 'END') {
      this.props.onUpdateBlockTracking({ isComplete: true });
    }
  }

  render() {
    const mediaUrl = this.getMediaUrl(this.props.block);

    return (
      <MediaBlockPlayer
        mediaUrl={mediaUrl}
        isReady={this.state.isReady}
        onVideoReady={this.onVideoReady}
        onVideoStarted={this.onVideoStarted}
        onVideoEnded={this.onVideoEnded}
      />
    );
  }
};

export default MediaBlockPlayerContainer;
