import { describe, it, expect } from 'vitest';
import getStemLabelsByRef from '../helpers/getStemLabelsByRef';
import { buildStem, buildSlide } from './overviewFixtures';

describe('getStemLabelsByRef', () => {
  it('returns an empty object when there is no root stem', () => {
    expect(getStemLabelsByRef({ stems: [buildStem('B1')], slides: [], scenarioId: 'scenario-1' })).toEqual({});
  });

  it('returns column letter and number labels keyed by stem ref', () => {
    const stems = [
      buildStem('root', ['first', 'second'], true),
      buildStem('first', ['firstChild']),
      buildStem('second'),
      buildStem('firstChild')
    ];
    const slides = [
      buildSlide('slide-root', 'root'),
      buildSlide('slide-first', 'first'),
      buildSlide('slide-second', 'second'),
      buildSlide('slide-first-child', 'firstChild')
    ];

    expect(getStemLabelsByRef({ stems, slides, scenarioId: 'scenario-1' })).toEqual({
      root: 'A',
      first: 'B1',
      second: 'B2',
      firstChild: 'C1'
    });
  });

  it('gives a shared stem a single label', () => {
    const stems = [
      buildStem('root', ['first', 'second'], true),
      buildStem('first', ['shared']),
      buildStem('second', ['shared']),
      buildStem('shared')
    ];

    const stemLabelsByRef = getStemLabelsByRef({ stems, slides: [], scenarioId: 'scenario-1' });

    expect(stemLabelsByRef.shared).toBe('C1');
  });
});
