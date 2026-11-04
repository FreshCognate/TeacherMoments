import { describe, it, expect } from 'vitest';
import setCanBeBranchedTo from '../helpers/setCanBeBranchedTo';
import { buildStem, buildPositionedStem } from './overviewFixtures';

const buildOverview = () => {
  const firstChild = buildPositionedStem({ ref: 'C1' });
  const secondChild = buildPositionedStem({ ref: 'C2' });
  const firstStem = buildPositionedStem({ ref: 'B1', stems: [firstChild] });
  const secondStem = buildPositionedStem({ ref: 'B2', stems: [secondChild] });
  const tree = buildPositionedStem({ ref: 'A', stems: [firstStem, secondStem] });
  return { tree, firstStem, secondStem, firstChild, secondChild };
};

const stems = [
  buildStem('A', ['B1', 'B2'], true),
  buildStem('B1', ['C1']),
  buildStem('B2', ['C2']),
  buildStem('C1'),
  buildStem('C2')
];

const columnsByRef = { A: 0, B1: 1, B2: 1, C1: 2, C2: 2 };

describe('setCanBeBranchedTo', () => {
  it('does nothing when no stem is being branched from', () => {
    const { tree, firstChild } = buildOverview();

    setCanBeBranchedTo({ tree, stems, branchToStem: null, columnsByRef });

    expect(firstChild.canBeBranchedTo).toBe(false);
  });

  it('allows stems in later columns that are not already children', () => {
    const { tree, firstStem, secondStem, firstChild, secondChild } = buildOverview();

    setCanBeBranchedTo({ tree, stems, branchToStem: 'B1', columnsByRef });

    expect(tree.canBeBranchedTo).toBe(false);
    expect(firstStem.canBeBranchedTo).toBe(false);
    expect(secondStem.canBeBranchedTo).toBe(false);
    expect(firstChild.canBeBranchedTo).toBe(false);
    expect(secondChild.canBeBranchedTo).toBe(true);
  });

  it('does nothing when the branched from stem is not in the tree', () => {
    const { tree, secondChild } = buildOverview();

    setCanBeBranchedTo({ tree, stems, branchToStem: 'MISSING', columnsByRef });

    expect(secondChild.canBeBranchedTo).toBe(false);
  });
});
