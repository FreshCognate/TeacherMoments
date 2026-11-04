import { describe, it, expect } from 'vitest';
import parseTree from '../helpers/parseTree';
import { buildPositionedStem } from './overviewFixtures';

describe('parseTree', () => {
  it('stacks leaves downwards and centres parents on their children', () => {
    const firstStem = buildPositionedStem({ ref: 'B1' });
    const secondStem = buildPositionedStem({ ref: 'B2' });
    const tree = buildPositionedStem({ ref: 'A', stems: [firstStem, secondStem] });

    const { maxWidth, maxHeight } = parseTree({ tree, offsetsX: { A: 0, B1: 172, B2: 172 } });

    expect(firstStem.y).toBe(0);
    expect(secondStem.y).toBe(120);
    expect(tree.y).toBe(60);
    expect(tree.x).toBe(0);
    expect(firstStem.x).toBe(172);
    expect(maxWidth).toBe(224);
    expect(maxHeight).toBe(240);
  });

  it('starts from zero on every call', () => {
    const tree = buildPositionedStem({ ref: 'A' });

    parseTree({ tree, offsetsX: { A: 0 } });
    const { maxHeight } = parseTree({ tree, offsetsX: { A: 0 } });

    expect(tree.y).toBe(0);
    expect(maxHeight).toBe(120);
  });
});
