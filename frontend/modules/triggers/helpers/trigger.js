import sortBy from 'lodash/sortBy';
import filter from 'lodash/filter';
import getCache from '~/core/cache/helpers/getCache';
import getTrigger from './getTrigger';

export default ({ triggerType, elementRef }, context) => {
  const triggers = getCache('triggers');

  const filteredTriggers = sortBy(filter(triggers.data, { triggerType, elementRef }), 'sortOrder');

  const promise = new Promise(async (resolve) => {
    for (const trigger of filteredTriggers) {
      const triggerItem = getTrigger(trigger.action);
      if (trigger) {
        await triggerItem.trigger({ trigger, context })
      }
    }
    resolve();
  });

  return promise;
}