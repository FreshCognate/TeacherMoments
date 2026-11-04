import each from 'lodash/each';
import { PositionedStem, Edge, OVERVIEW_STEM_HEIGHT } from '../create.types';
import getStemWidth from './getStemWidth';

export default ({ stemsByRef }: { stemsByRef: Record<string, PositionedStem> }): Edge[] => {
  const edges: Edge[] = [];

  each(stemsByRef, (stem) => {
    each(stem.childStemRefs, (childStemRef) => {
      const childStem = stemsByRef[childStemRef];
      if (!childStem) return;
      edges.push({
        from: { x: stem.x + getStemWidth({ stem }), y: stem.y + OVERVIEW_STEM_HEIGHT / 2 },
        to: { x: childStem.x, y: childStem.y + OVERVIEW_STEM_HEIGHT / 2 }
      });
    });
  });

  return edges;
};
