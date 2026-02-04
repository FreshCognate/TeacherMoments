import filter from 'lodash/filter';
import getCache from '~/core/cache/helpers/getCache';

export default ({ slideRef }) => {
  const triggers = getCache('triggers');
  return filter(triggers.data, { elementRef: slideRef });
};
