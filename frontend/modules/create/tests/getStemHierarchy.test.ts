import { describe, it, expect } from 'vitest';
import map from 'lodash/map';
import getStemHierarchy from '../helpers/getStemHierarchy';
import { Stem } from '~/modules/stems/stems.types';

const buildStem = (ref: string, childRefs: string[] = [], isRoot = false) => ({
  ref,
  isRoot,
  branchingOptions: map(childRefs, (stemRef) => ({ stemRef, conditions: [] }))
}) as unknown as Stem;

describe('getStemHierarchy', () => {
  it('gives each stem a depth based on its tree position', () => {
    const rootStem = buildStem('A', ['B1', 'B2'], true);
    const stems = [rootStem, buildStem('B1', ['C1']), buildStem('B2'), buildStem('C1')];

    const { depthsByRef, ownerRefsByRef } = getStemHierarchy({ stems, rootStem });

    expect(depthsByRef).toEqual({ A: 0, B1: 1, B2: 1, C1: 2 });
    expect(ownerRefsByRef).toEqual({ B1: 'A', B2: 'A', C1: 'B1' });
  });

  it('places a shared stem in the column after its deepest parent but under its first visited parent', () => {
    const rootStem = buildStem('A', ['B1', 'B2'], true);
    const stems = [
      rootStem,
      buildStem('B1', ['B1-C1', 'B1-C2', 'B1-C3', 'SHARED']),
      buildStem('B2', ['B2-C1']),
      buildStem('B1-C1'),
      buildStem('B1-C2'),
      buildStem('B1-C3'),
      buildStem('B2-C1', ['SHARED', 'B2-C1-D2']),
      buildStem('SHARED'),
      buildStem('B2-C1-D2')
    ];

    const { depthsByRef, ownerRefsByRef } = getStemHierarchy({ stems, rootStem });

    expect(depthsByRef.SHARED).toBe(3);
    expect(ownerRefsByRef.SHARED).toBe('B1');
  });

  it('assigns a shared stem to the first visited parent when parents are the same depth', () => {
    const rootStem = buildStem('A', ['B1', 'B2'], true);
    const stems = [rootStem, buildStem('B1', ['SHARED']), buildStem('B2', ['SHARED']), buildStem('SHARED')];

    const { depthsByRef, ownerRefsByRef } = getStemHierarchy({ stems, rootStem });

    expect(depthsByRef.SHARED).toBe(2);
    expect(ownerRefsByRef.SHARED).toBe('B1');
  });

  it('ignores branching options to missing stems and links back to the root', () => {
    const rootStem = buildStem('A', ['B1', 'MISSING'], true);
    const stems = [rootStem, buildStem('B1', ['A'])];

    const { depthsByRef, ownerRefsByRef } = getStemHierarchy({ stems, rootStem });

    expect(depthsByRef).toEqual({ A: 0, B1: 1 });
    expect(ownerRefsByRef).toEqual({ B1: 'A' });
  });

  it('does not loop forever on cyclic branching', () => {
    const rootStem = buildStem('A', ['B1'], true);
    const stems = [rootStem, buildStem('B1', ['C1']), buildStem('C1', ['B1'])];

    const { depthsByRef } = getStemHierarchy({ stems, rootStem });

    expect(depthsByRef.A).toBe(0);
    expect(depthsByRef.B1).toBeGreaterThan(0);
  });
});
