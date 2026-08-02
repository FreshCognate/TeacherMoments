import { describe, it, expect } from 'vitest';
import getSlideLabel from '../helpers/getSlideLabel';

describe('getSlideLabel', () => {
  it('uses the slide name when present', () => {
    expect(getSlideLabel({ slideName: 'Intro', slideSortOrder: 0 })).toBe('Intro');
  });

  it('falls back to a 1-indexed "Slide N" when there is no name', () => {
    expect(getSlideLabel({ slideSortOrder: 2 })).toBe('Slide 3');
  });

  it('prefixes branch slides with the stem name', () => {
    expect(getSlideLabel({ slideSortOrder: 0, stemName: 'Stem 1' })).toBe('Stem 1: Slide 1');
  });

  it('prefixes a named slide too', () => {
    expect(getSlideLabel({ slideName: 'Outcome', slideSortOrder: 0, stemName: 'Wrong path' })).toBe('Wrong path: Outcome');
  });

  it('adds no prefix for root-stem slides', () => {
    expect(getSlideLabel({ slideSortOrder: 1, stemName: null })).toBe('Slide 2');
  });
});
