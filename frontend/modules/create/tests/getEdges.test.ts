import { describe, it, expect } from 'vitest';
import getEdges from '../helpers/getEdges';
import { buildPositionedStem } from './overviewFixtures';

describe('getEdges', () => {
  it('joins the right of each parent to the left of each child', () => {
    const stemsByRef = {
      A: buildPositionedStem({ ref: 'A', childStemRefs: ['B1'], x: 0, y: 60 }),
      B1: buildPositionedStem({ ref: 'B1', x: 172, y: 0 })
    };

    expect(getEdges({ stemsByRef })).toEqual([{
      from: { x: 52, y: 86 },
      to: { x: 172, y: 26 }
    }]);
  });

  it('skips child refs that are not in the tree', () => {
    const stemsByRef = {
      A: buildPositionedStem({ ref: 'A', childStemRefs: ['MISSING'] })
    };

    expect(getEdges({ stemsByRef })).toEqual([]);
  });
});
