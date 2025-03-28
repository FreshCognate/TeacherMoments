import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import getCache from '~/core/cache/helpers/getCache';

export default ({ elementRef, triggerType, event }) => {
  const triggers = getCache('triggers');
  return sortBy(filter(triggers.data, { elementRef, triggerType, event }), 'sortOrder');
}