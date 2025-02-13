import each from 'lodash/each';
import extend from 'lodash/extend';

const ACCEPTS = {
  'image': {
    'image/png': [],
    'image/jpg': [],
    'image/jpeg': [],
    'image/gif': [],
    'image/svg+xml': [],
    'image/webp': []
  },
  'video': {
    'video/mp4': [],
    'video/mpeg': [],
  },
  'audio': {
    'audio/mpeg': []
  },
};

export default (fileTypes) => {
  const accepts = {};
  each(fileTypes, (fileType) => {
    extend(accepts, ACCEPTS[fileType]);
  });
  return accepts;
}