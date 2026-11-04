import { describe, it, expect } from 'vitest';
import getOffsetsX from '../helpers/getOffsetsX';
import { buildPositionedStem } from './overviewFixtures';

describe('getOffsetsX', () => {
  it('places each stem after its parent', () => {
    const stemsByRef = {
      A: buildPositionedStem({ ref: 'A', slideCount: 1, childStemRefs: ['B1'] }),
      B1: buildPositionedStem({ ref: 'B1', slideCount: 1 })
    };

    expect(getOffsetsX({ stemsByRef })).toEqual({ A: 0, B1: 172 });
  });

  it('places a shared stem after its right-most parent', () => {
    const stemsByRef = {
      A: buildPositionedStem({ ref: 'A', slideCount: 1, childStemRefs: ['B1', 'SHARED'] }),
      B1: buildPositionedStem({ ref: 'B1', slideCount: 3, childStemRefs: ['SHARED'] }),
      SHARED: buildPositionedStem({ ref: 'SHARED', slideCount: 1 })
    };

    expect(getOffsetsX({ stemsByRef })).toEqual({ A: 0, B1: 172, SHARED: 432 });
  });
});
