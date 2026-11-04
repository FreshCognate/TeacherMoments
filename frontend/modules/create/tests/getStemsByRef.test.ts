import { describe, it, expect } from 'vitest';
import keys from 'lodash/keys';
import getStemsByRef from '../helpers/getStemsByRef';
import { buildPositionedStem } from './overviewFixtures';

describe('getStemsByRef', () => {
  it('flattens the tree into stems keyed by ref in tree order', () => {
    const child = buildPositionedStem({ ref: 'C1' });
    const firstStem = buildPositionedStem({ ref: 'B1', stems: [child] });
    const secondStem = buildPositionedStem({ ref: 'B2' });
    const tree = buildPositionedStem({ ref: 'A', stems: [firstStem, secondStem] });

    const stemsByRef = getStemsByRef({ tree });

    expect(keys(stemsByRef)).toEqual(['A', 'B1', 'C1', 'B2']);
    expect(stemsByRef.C1).toBe(child);
  });
});
