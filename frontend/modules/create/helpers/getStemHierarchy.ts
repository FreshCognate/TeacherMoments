import each from 'lodash/each';
import has from 'lodash/has';
import keyBy from 'lodash/keyBy';
import includes from 'lodash/includes';
import { Stem } from '~/modules/stems/stems.types';

type StemHierarchy = {
  depthsByRef: Record<string, number>;
  ownerRefsByRef: Record<string, string>;
};

export default ({ stems, rootStem }: { stems: Stem[], rootStem: Stem }): StemHierarchy => {
  const stemsByRef = keyBy(stems, 'ref');
  const parentRefsByRef: Record<string, string[]> = {};
  const visitOrderByRef: Record<string, number> = {};
  let visitCount = 0;

  const visitStem = (stem: Stem) => {
    visitOrderByRef[stem.ref] = visitCount++;
    each(stem.branchingOptions, (branchingOption) => {
      const childStem = stemsByRef[branchingOption.stemRef];
      if (!childStem || childStem.ref === rootStem.ref) return;
      const parentRefs = parentRefsByRef[childStem.ref] || [];
      if (!includes(parentRefs, stem.ref)) {
        parentRefsByRef[childStem.ref] = [...parentRefs, stem.ref];
      }
      if (!has(visitOrderByRef, childStem.ref)) visitStem(childStem);
    });
  };

  visitStem(rootStem);

  const depthsByRef: Record<string, number> = { [rootStem.ref]: 0 };
  const visitingRefs = new Set<string>();

  const getDepth = (stemRef: string): number => {
    if (has(depthsByRef, stemRef)) return depthsByRef[stemRef];
    visitingRefs.add(stemRef);
    let depth = 0;
    each(parentRefsByRef[stemRef], (parentRef) => {
      if (visitingRefs.has(parentRef)) return;
      depth = Math.max(depth, getDepth(parentRef) + 1);
    });
    visitingRefs.delete(stemRef);
    depthsByRef[stemRef] = depth;
    return depth;
  };

  each(visitOrderByRef, (visitOrder, stemRef) => getDepth(stemRef));

  const ownerRefsByRef: Record<string, string> = {};

  each(parentRefsByRef, (parentRefs, stemRef) => {
    let ownerRef: string | null = null;
    each(parentRefs, (parentRef) => {
      if (!ownerRef) {
        ownerRef = parentRef;
        return;
      }
      const isDeeper = depthsByRef[parentRef] > depthsByRef[ownerRef];
      const isSameDepth = depthsByRef[parentRef] === depthsByRef[ownerRef];
      const isVisitedFirst = visitOrderByRef[parentRef] < visitOrderByRef[ownerRef];
      if (isDeeper || (isSameDepth && isVisitedFirst)) ownerRef = parentRef;
    });
    if (ownerRef) ownerRefsByRef[stemRef] = ownerRef;
  });

  return { depthsByRef, ownerRefsByRef };
};
