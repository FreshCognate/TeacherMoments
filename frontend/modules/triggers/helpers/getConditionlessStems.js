import filter from 'lodash/filter';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import getStemsByStemRef from '~/modules/stems/helpers/getStemsByStemRef';

export default ({ stem }) => {

  const childStems = getStemsByStemRef({ stemRef: stem.ref });

  const conditionlessStems = filter(childStems, (childStem) => {
    const branchingOption = find(stem.branchingOptions, { elementRef: childStem.ref });
    return !branchingOption || !branchingOption.conditions?.length;
  });

  return sortBy(conditionlessStems, 'sortOrder');
};
