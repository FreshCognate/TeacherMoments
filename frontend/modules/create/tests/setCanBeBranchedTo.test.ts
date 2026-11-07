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

  it('allows siblings and stems in later columns that are not already children', () => {
    const { tree, firstStem, secondStem, firstChild, secondChild } = buildOverview();

    setCanBeBranchedTo({ tree, stems, branchToStem: 'B1', columnsByRef });

    expect(tree.canBeBranchedTo).toBe(false);
    expect(firstStem.canBeBranchedTo).toBe(false);
    expect(secondStem.canBeBranchedTo).toBe(true);
    expect(firstChild.canBeBranchedTo).toBe(false);
    expect(secondChild.canBeBranchedTo).toBe(true);
  });

  it('allows stems in the same column that do not share a parent', () => {
    const { tree, firstChild, secondChild } = buildOverview();

    setCanBeBranchedTo({ tree, stems, branchToStem: 'C1', columnsByRef });

    expect(firstChild.canBeBranchedTo).toBe(false);
    expect(secondChild.canBeBranchedTo).toBe(true);
  });

  it('does not allow a sibling that is also an ancestor', () => {
    const child = buildPositionedStem({ ref: 'C' });
    const sibling = buildPositionedStem({ ref: 'B', stems: [child] });
    const tree = buildPositionedStem({ ref: 'A', stems: [sibling] });
    const ancestorStems = [
      buildStem('A', ['B', 'C'], true),
      buildStem('B', ['C']),
      buildStem('C')
    ];

    setCanBeBranchedTo({
      tree,
      stems: ancestorStems,
      branchToStem: 'C',
      columnsByRef: { A: 0, B: 1, C: 2 }
    });

    expect(sibling.canBeBranchedTo).toBe(false);
  });

  it('does nothing when the branched from stem is not in the tree', () => {
    const { tree, secondChild } = buildOverview();

    setCanBeBranchedTo({ tree, stems, branchToStem: 'MISSING', columnsByRef });

    expect(secondChild.canBeBranchedTo).toBe(false);
  });
});
