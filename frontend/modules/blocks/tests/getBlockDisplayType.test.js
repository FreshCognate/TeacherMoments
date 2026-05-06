import { describe, it, expect } from 'vitest';
import getBlockDisplayType from '../helpers/getBlockDisplayType.js';

describe('getBlockDisplayType', () => {
  it('returns "VISUAL" for visual block types', () => {
    expect(getBlockDisplayType({ blockType: 'TEXT' })).toBe('VISUAL');
    expect(getBlockDisplayType({ blockType: 'IMAGES' })).toBe('VISUAL');
    expect(getBlockDisplayType({ blockType: 'MEDIA' })).toBe('VISUAL');
    expect(getBlockDisplayType({ blockType: 'SUGGESTION' })).toBe('VISUAL');
    expect(getBlockDisplayType({ blockType: 'RESPONSE' })).toBe('VISUAL');
  });

  it('returns "PROMPT" for prompt block types', () => {
    expect(getBlockDisplayType({ blockType: 'INPUT_PROMPT' })).toBe('PROMPT');
    expect(getBlockDisplayType({ blockType: 'MULTIPLE_CHOICE_PROMPT' })).toBe('PROMPT');
    expect(getBlockDisplayType({ blockType: 'ACTIONS_PROMPT' })).toBe('PROMPT');
  });
});
