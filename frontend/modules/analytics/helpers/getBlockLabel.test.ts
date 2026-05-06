import { describe, it, expect } from 'vitest';
import getBlockLabel from './getBlockLabel';

const baseBlock = {
  ref: 'r1',
  slideRef: 's1',
  slideSortOrder: 0,
  blockType: 'INPUT_PROMPT',
  sortOrder: 0
};

describe('getBlockLabel', () => {
  it('uses the block name when provided', () => {
    expect(getBlockLabel({ ...baseBlock, name: 'Question 1' })).toBe('Question 1');
  });

  it('falls back to the block ref when no name is set', () => {
    expect(getBlockLabel({ ...baseBlock, ref: 'block-abc' })).toBe('block-abc');
  });

  it('falls back to "Block {n+1}" when no name and no ref', () => {
    expect(getBlockLabel({ ...baseBlock, ref: '', sortOrder: 4 })).toBe('Block 5');
  });

  it('prefixes the slide name when present', () => {
    expect(
      getBlockLabel({ ...baseBlock, name: 'Question 1', slideName: 'Intro' })
    ).toBe('Intro - Question 1');
  });
});
