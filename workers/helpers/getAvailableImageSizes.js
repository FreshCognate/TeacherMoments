import filter from 'lodash/filter.js';

export const SIZES = [640, 320, 160];

export default (width, sizes = SIZES) => {
  return filter(sizes, (size) => width >= size);
};
