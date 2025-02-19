import React from 'react';
import ReactPlayer from 'react-player';

const MediaBlockPlayer = ({
  mediaType,
  mediaSrc,
  onVideoStarted,
  onVideoEnded
}) => {

  let mediaUrl;
  if (mediaType === 'YOUTUBE') {
    mediaUrl = mediaSrc
  }

  return (
    <div className="aspect-video">
      <ReactPlayer
        url={mediaUrl}
        controls
        width="100%"
        height="100%"
        onStart={onVideoStarted}
        onEnded={onVideoEnded}
      />
    </div>
  );
};

export default MediaBlockPlayer;