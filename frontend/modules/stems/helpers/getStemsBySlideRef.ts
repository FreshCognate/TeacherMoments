import filter from 'lodash/filter';
import getCache from '~/core/cache/helpers/getCache';

export default ({ slideRef }: { slideRef: string }) => {
  const stems = getCache('stems').data;
  const slideStems = filter(stems, { slideRef });
  return slideStems;
}