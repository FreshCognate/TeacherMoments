import { describe, it, expect } from 'vitest';
import getSlideOrderByStemTraversal from '../helpers/getSlideOrderByStemTraversal.js';

const orderedRefs = (map) => [...map.entries()].sort((a, b) => a[1] - b[1]).map(([ref]) => ref);

describe('getSlideOrderByStemTraversal', () => {
  it('expands branches inline after their branch-point slide (authoring order)', () => {
    // slide 1, slide 2 (branches: stem 1 -> [s1a, s1b], stem 2 -> [s2a, s2b]), slide 3
    const slides = [
      { ref: 's1', stemRef: 'root', sortOrder: 0 },
      { ref: 's2', stemRef: 'root', sortOrder: 1 },
      { ref: 's3', stemRef: 'root', sortOrder: 2 },
      { ref: 's1a', stemRef: 'stem1', sortOrder: 0 },
      { ref: 's1b', stemRef: 'stem1', sortOrder: 1 },
      { ref: 's2a', stemRef: 'stem2', sortOrder: 0 },
      { ref: 's2b', stemRef: 'stem2', sortOrder: 1 }
    ];
    const stems = [
      { ref: 'root', isRoot: true },
      { ref: 'stem1', slideRef: 's2', sortOrder: 0 },
      { ref: 'stem2', slideRef: 's2', sortOrder: 1 }
    ];

    const order = getSlideOrderByStemTraversal({ slides, stems });

    expect(orderedRefs(order)).toEqual(['s1', 's2', 's1a', 's1b', 's2a', 's2b', 's3']);
  });

  it('recurses into nested branches (a branch off a branch slide)', () => {
    const slides = [
      { ref: 's1', stemRef: 'root', sortOrder: 0 },
      { ref: 's2', stemRef: 'root', sortOrder: 1 },
      { ref: 'b1', stemRef: 'stem1', sortOrder: 0 },
      { ref: 'b2', stemRef: 'stem1', sortOrder: 1 },
      { ref: 'n1', stemRef: 'stem1a', sortOrder: 0 }
    ];
    const stems = [
      { ref: 'root', isRoot: true },
      { ref: 'stem1', slideRef: 's1', sortOrder: 0 },
      { ref: 'stem1a', slideRef: 'b1', sortOrder: 0 }
    ];

    const order = getSlideOrderByStemTraversal({ slides, stems });

    expect(orderedRefs(order)).toEqual(['s1', 'b1', 'n1', 'b2', 's2']);
  });

  it('orders sibling branches by their stem sortOrder', () => {
    const slides = [
      { ref: 's1', stemRef: 'root', sortOrder: 0 },
      { ref: 'a', stemRef: 'stemA', sortOrder: 0 },
      { ref: 'b', stemRef: 'stemB', sortOrder: 0 }
    ];
    const stems = [
      { ref: 'root', isRoot: true },
      { ref: 'stemB', slideRef: 's1', sortOrder: 1 },
      { ref: 'stemA', slideRef: 's1', sortOrder: 0 }
    ];

    const order = getSlideOrderByStemTraversal({ slides, stems });

    expect(orderedRefs(order)).toEqual(['s1', 'a', 'b']);
  });

  it('returns an empty order when there is no root stem', () => {
    const slides = [
      { ref: 's2', stemRef: 'x', sortOrder: 1 },
      { ref: 's1', stemRef: 'x', sortOrder: 0 }
    ];

    const order = getSlideOrderByStemTraversal({ slides, stems: [] });

    expect(order.size).toBe(0);
  });

  it('only orders slides reachable from the root (orphans are omitted)', () => {
    const slides = [
      { ref: 's1', stemRef: 'root', sortOrder: 0 },
      { ref: 'orphan', stemRef: 'ghost', sortOrder: 0 }
    ];
    const stems = [{ ref: 'root', isRoot: true }];

    const order = getSlideOrderByStemTraversal({ slides, stems });

    expect(orderedRefs(order)).toEqual(['s1']);
    expect(order.has('orphan')).toBe(false);
  });
});
