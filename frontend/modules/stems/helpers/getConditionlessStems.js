import filter from 'lodash/filter';
import find from 'lodash/find';
import getChildStems from './getChildStems';

export default ({ stem }) => {

  if (!stem) return [];
  const childStems = getChildStems({ stem });

  return filter(childStems, (childStem) => {
    const branchingOption = find(stem.branchingOptions, { stemRef: childStem.ref });
    return !branchingOption?.conditions?.length;
  });
};
