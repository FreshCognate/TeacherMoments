import find from 'lodash/find';
import getCache from '~/core/cache/helpers/getCache';

export default () => {
  const stems = getCache('stems');
  const rootStem = find(stems.data, { isRoot: true });
  return rootStem;
}