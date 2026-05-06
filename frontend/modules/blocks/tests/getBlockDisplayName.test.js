import { describe, it, expect } from 'vitest';
import getBlockDisplayName from '../helpers/getBlockDisplayName.js';

describe('getBlockDisplayName', () => {
  it('returns the human-readable name for known block types', () => {
    expect(getBlockDisplayName({ blockType: 'TEXT' })).toBe('Text');
    expect(getBlockDisplayName({ blockType: 'IMAGES' })).toBe('Images');
    expect(getBlockDisplayName({ blockType: 'INPUT_PROMPT' })).toBe('Input prompt');
    expect(getBlockDisplayName({ blockType: 'MULTIPLE_CHOICE_PROMPT' })).toBe('Multiple choice prompt');
    expect(getBlockDisplayName({ blockType: 'MEDIA' })).toBe('Media');
    expect(getBlockDisplayName({ blockType: 'SUGGESTION' })).toBe('Suggestion');
    expect(getBlockDisplayName({ blockType: 'RESPONSE' })).toBe('Response');
    expect(getBlockDisplayName({ blockType: 'ACTIONS_PROMPT' })).toBe('Actions prompt');
  });
});
