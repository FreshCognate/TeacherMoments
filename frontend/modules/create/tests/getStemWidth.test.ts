import { describe, it, expect } from 'vitest';
import getStemWidth from '../helpers/getStemWidth';
import { buildPositionedStem } from './overviewFixtures';

describe('getStemWidth', () => {
  it('sizes a single slide stem', () => {
    expect(getStemWidth({ stem: buildPositionedStem({ ref: 'A', slideCount: 1 }) })).toBe(52);
  });

  it('adds slide width and gap for each extra slide', () => {
    expect(getStemWidth({ stem: buildPositionedStem({ ref: 'A', slideCount: 3 }) })).toBe(140);
  });
});
