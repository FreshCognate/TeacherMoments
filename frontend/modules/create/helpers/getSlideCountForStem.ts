import filter from 'lodash/filter';
import getCache from '~/core/cache/helpers/getCache';

export default (stemRef: string) => {
  const slides = getCache('slides');
  return filter(slides.data, { stemRef }).length;
}