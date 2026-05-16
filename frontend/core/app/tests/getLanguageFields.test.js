import { describe, it, expect } from 'vitest';
import getLanguageFields from '../helpers/getLanguageFields.js';

describe('getLanguageFields', () => {
  it('maps each language-prefixed field on the model to its output key', () => {
    const result = getLanguageFields({
      model: {
        'en-US-rawTitle': 'Hello',
        'fr-FR-rawTitle': 'Bonjour'
      },
      fields: { rawTitle: 'title' }
    });

    expect(result).toEqual({
      'en-US-title': 'Hello',
      'fr-FR-title': 'Bonjour'
    });
  });

  it('skips entries that are missing or falsy on the model', () => {
    const result = getLanguageFields({
      model: { 'en-US-rawTitle': 'Hello' },
      fields: { rawTitle: 'title' }
    });

    expect(result).toEqual({ 'en-US-title': 'Hello' });
    expect(result).not.toHaveProperty('fr-FR-title');
  });
});
