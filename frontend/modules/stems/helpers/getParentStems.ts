import filter from 'lodash/filter';
import some from 'lodash/some';
import getCache from '~/core/cache/helpers/getCache';
import { Stem } from '../stems.types';

export default ({ stem }: { stem?: Stem }): Stem[] => {
  if (!stem) return [];
  const stems = getCache('stems').data;
  return filter(stems, (parentStem: Stem) => some(parentStem.branchingOptions, { stemRef: stem.ref }));
}
