import React from 'react';
import ReactPlayer from 'react-player';
import getAssetUrl from '~/core/app/helpers/getAssetUrl';

const MediaBlockPlayer = ({
  mediaType,
  mediaSrc,
  mediaAsset,
  onVideoStarted,
  onVideoEnded
}) => {

  let mediaUrl;
  if (mediaType === 'YOUTUBE') {
    mediaUrl = mediaSrc
  }

  if (mediaType === 'ASSET') {
    mediaUrl = getAssetUrl(mediaAsset, 'original');
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