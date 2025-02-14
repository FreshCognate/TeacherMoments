const FILE_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'image/webp': 'webp',
  'audio/mpeg': 'mp3',
  'audio/m4a': 'm4a',
  'audio/ogg': 'ogg',
  'video/mpeg': 'mp4',
  'video/mp4': 'mp4'
};

export default function (fileType) {
  return FILE_TYPES[fileType];
};