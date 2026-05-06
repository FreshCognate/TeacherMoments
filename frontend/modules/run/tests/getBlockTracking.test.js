import { describe, it, expect, vi } from 'vitest';

vi.mock('../helpers/getCurrentStage', () => ({
  default: vi.fn()
}));

import getBlockTracking from '../helpers/getBlockTracking';
import getCurrentStage from '../helpers/getCurrentStage';

describe('getBlockTracking', () => {
  it('returns the block tracking entry from the current stage by ref', () => {
    getCurrentStage.mockReturnValue({
      blocksByRef: {
        'block-1': { isComplete: true, textValue: 'hello' }
      }
    });

    expect(getBlockTracking({ blockRef: 'block-1' })).toEqual({
      isComplete: true,
      textValue: 'hello'
    });
  });

  it('returns an empty object when the block ref is not present', () => {
    getCurrentStage.mockReturnValue({ blocksByRef: {} });
    expect(getBlockTracking({ blockRef: 'block-x' })).toEqual({});
  });

  it('returns an empty object when there is no current stage', () => {
    getCurrentStage.mockReturnValue(null);
    expect(getBlockTracking({ blockRef: 'block-1' })).toEqual({});
  });
});
