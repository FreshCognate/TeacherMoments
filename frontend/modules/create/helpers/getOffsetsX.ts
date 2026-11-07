import each from 'lodash/each';
import has from 'lodash/has';
import keys from 'lodash/keys';
import { PositionedStem, OVERVIEW_GAP_X } from '../create.types';
import getStemWidth from './getStemWidth';

export default ({ stemsByRef }: { stemsByRef: Record<string, PositionedStem> }) => {
  const parentStemRefsByRef: Record<string, string[]> = {};

  each(stemsByRef, (stem) => {
    each(stem.childStemRefs, (childStemRef) => {
      parentStemRefsByRef[childStemRef] = [...(parentStemRefsByRef[childStemRef] || []), stem.ref];
    });
  });

  const offsetsX: Record<string, number> = {};

  const getOffsetX = (stemRef: string): number => {
    if (has(offsetsX, stemRef)) return offsetsX[stemRef];
    offsetsX[stemRef] = 0;
    each(parentStemRefsByRef[stemRef], (parentStemRef) => {
      const parentRight = getOffsetX(parentStemRef) + getStemWidth({ stem: stemsByRef[parentStemRef] });
      offsetsX[stemRef] = Math.max(offsetsX[stemRef], parentRight + OVERVIEW_GAP_X);
    });
    return offsetsX[stemRef];
  };

  each(keys(stemsByRef), getOffsetX);

  return offsetsX;
};
