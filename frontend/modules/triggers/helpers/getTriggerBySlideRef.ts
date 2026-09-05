import find from 'lodash/find';
import getCache from '~/core/cache/helpers/getCache';

export default ({ slideRef }: { slideRef: string }) => {
  const triggers = getCache('triggers');
  return find(triggers.data, { elementRef: slideRef });
};
