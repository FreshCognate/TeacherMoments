import { describe, it, expect, vi } from 'vitest';

vi.mock('react-media-recorder', () => ({ ReactMediaRecorder: () => null }));

import getBlockComponent from './getBlockComponent.js';

describe('getBlockComponent', () => {
  it.each([
    'TEXT',
    'IMAGES',
    'MEDIA',
    'SUGGESTION',
    'RESPONSE',
    'MULTIPLE_CHOICE_PROMPT',
    'INPUT_PROMPT',
    'ACTIONS_PROMPT'
  ])('returns a defined container for the %s block type', (blockType) => {
    expect(getBlockComponent({ blockType })).toBeDefined();
  });

  it('returns undefined for an unknown block type', () => {
    expect(getBlockComponent({ blockType: 'BOGUS' })).toBeUndefined();
  });

  it('returns the same container reference on repeated calls', () => {
    const first = getBlockComponent({ blockType: 'TEXT' });
    const second = getBlockComponent({ blockType: 'TEXT' });
    expect(first).toBe(second);
  });
});
