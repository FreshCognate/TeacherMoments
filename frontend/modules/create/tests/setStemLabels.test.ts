import { describe, it, expect } from 'vitest';
import setStemLabels from '../helpers/setStemLabels';
import { buildPositionedStem } from './overviewFixtures';

describe('setStemLabels', () => {
  it('labels the root stem as A', () => {
    const stemsByRef = { root: buildPositionedStem({ ref: 'root' }) };

    setStemLabels({ stemsByRef, columnsByRef: { root: 0 } });

    expect(stemsByRef.root.label).toBe('A');
  });

  it('labels stems by column letter and numbers them top to bottom within the column', () => {
    const stemsByRef = {
      root: buildPositionedStem({ ref: 'root', y: 120 }),
      first: buildPositionedStem({ ref: 'first', y: 60 }),
      second: buildPositionedStem({ ref: 'second', y: 240 }),
      sharedTop: buildPositionedStem({ ref: 'sharedTop', y: 0 }),
      sharedBottom: buildPositionedStem({ ref: 'sharedBottom', y: 120 }),
      secondChild: buildPositionedStem({ ref: 'secondChild', y: 240 })
    };

    setStemLabels({
      stemsByRef,
      columnsByRef: {
        root: 0,
        first: 1,
        second: 1,
        sharedTop: 2,
        sharedBottom: 2,
        secondChild: 2
      }
    });

    expect(stemsByRef.root.label).toBe('A');
    expect(stemsByRef.first.label).toBe('B1');
    expect(stemsByRef.second.label).toBe('B2');
    expect(stemsByRef.sharedTop.label).toBe('C1');
    expect(stemsByRef.sharedBottom.label).toBe('C2');
    expect(stemsByRef.secondChild.label).toBe('C3');
  });

  it('numbers by vertical position rather than tree order', () => {
    const stemsByRef = {
      A: buildPositionedStem({ ref: 'A', y: 60 }),
      lower: buildPositionedStem({ ref: 'lower', y: 120 }),
      upper: buildPositionedStem({ ref: 'upper', y: 0 })
    };

    setStemLabels({ stemsByRef, columnsByRef: { A: 0, lower: 1, upper: 1 } });

    expect(stemsByRef.A.label).toBe('A');
    expect(stemsByRef.upper.label).toBe('B1');
    expect(stemsByRef.lower.label).toBe('B2');
  });
});
