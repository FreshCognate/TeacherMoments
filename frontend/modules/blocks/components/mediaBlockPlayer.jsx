import ReactPlayer from 'react-player';

const MediaBlockPlayer = ({
  mediaUrl,
  isReady,
  onVideoReady,
  onVideoStarted,
  onVideoEnded
}) => {
  if (!mediaUrl) {
    return (
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">No media selected</span>
      </div>
    );
  }

  return (
    <div className="aspect-video relative">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="">Loading...</span>
        </div>
      )}
      <ReactPlayer
        key={mediaUrl}
        url={mediaUrl}
        controls
        width="100%"
        height="100%"
        onReady={onVideoReady}
        onStart={onVideoStarted}
        onEnded={onVideoEnded}
      />
    </div>
  );
};

export default MediaBlockPlayer;
