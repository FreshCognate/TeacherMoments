import compact from 'lodash/compact';
import map from 'lodash/map';
import getStemByRef from './getStemByRef';
import { Stem } from '../stems.types';

export default ({ stem }: { stem?: Stem }): Stem[] => {
  if (!stem) return [];
  return compact(map(stem.branchingOptions, (branchingOption) => getStemByRef({ ref: branchingOption.stemRef })));
}
