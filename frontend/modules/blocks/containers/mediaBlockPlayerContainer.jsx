import React, { Component } from 'react';
import MediaBlockPlayer from '../components/mediaBlockPlayer';

class MediaBlockPlayerContainer extends Component {
  render() {
    const { mediaType, mediaSrc } = this.props.block;
    return (
      <MediaBlockPlayer
        mediaType={mediaType}
        mediaSrc={mediaSrc}
      />
    );
  }
};

export default MediaBlockPlayerContainer;