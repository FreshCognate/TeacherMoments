import find from 'lodash/find';
import map from 'lodash/map';
import each from 'lodash/each';
import has from 'lodash/has';
import includes from 'lodash/includes';
import { Stem } from '~/modules/stems/stems.types';
import { OverviewStem } from '../create.types';

type Options = {
  tree: OverviewStem;
  stems: Stem[];
  branchToStem: string | null;
  columnsByRef: Record<string, number>;
};

export default ({ tree, stems, branchToStem, columnsByRef }: Options) => {
  if (!branchToStem || !has(columnsByRef, branchToStem)) return;

  const branchToStemColumn = columnsByRef[branchToStem];
  const branchFromStem = find(stems, { ref: branchToStem });
  const branchToStemChildRefs = map(branchFromStem?.branchingOptions, 'stemRef');

  const setStemCanBeBranchedTo = (stem: OverviewStem) => {
    const isInLaterColumn = columnsByRef[stem.ref] > branchToStemColumn;
    const isAlreadyChild = includes(branchToStemChildRefs, stem.ref);
    stem.canBeBranchedTo = isInLaterColumn && !isAlreadyChild;
    each(stem.stems, setStemCanBeBranchedTo);
  };

  setStemCanBeBranchedTo(tree);
};
