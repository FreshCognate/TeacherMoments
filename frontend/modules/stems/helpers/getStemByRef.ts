import find from 'lodash/find';
import getCache from '~/core/cache/helpers/getCache';

export default ({ ref }: { ref: string }) => {
  const stems = getCache('stems');
  const stem = find(stems.data, { ref });
  return stem;
}