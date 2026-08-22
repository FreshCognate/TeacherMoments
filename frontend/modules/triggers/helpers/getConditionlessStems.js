import filter from 'lodash/filter';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import getStemsBySlideRef from '~/modules/stems/helpers/getStemsBySlideRef';

export default ({ trigger }) => {
  const slideStems = getStemsBySlideRef({ slideRef: trigger.elementRef });

  const conditionlessStems = filter(slideStems, (slideStem) => {
    const item = find(trigger.items, { elementRef: slideStem.ref });
    return !item || !item.conditions?.length;
  });

  return sortBy(conditionlessStems, 'sortOrder');
};
