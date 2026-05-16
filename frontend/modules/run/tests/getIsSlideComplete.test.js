import { describe, it, expect } from 'vitest';
import getIsSlideComplete from '../helpers/getIsSlideComplete';

describe('getIsSlideComplete', () => {
  it('returns true when every block is complete', () => {
    expect(
      getIsSlideComplete({
        blocksByRef: {
          'b-1': { isComplete: true },
          'b-2': { isComplete: true }
        }
      })
    ).toBe(true);
  });

  it('returns false when any block is not complete', () => {
    expect(
      getIsSlideComplete({
        blocksByRef: {
          'b-1': { isComplete: true },
          'b-2': { isComplete: false }
        }
      })
    ).toBe(false);
  });

  it('returns true for an empty blocksByRef', () => {
    expect(getIsSlideComplete({ blocksByRef: {} })).toBe(true);
  });
});
