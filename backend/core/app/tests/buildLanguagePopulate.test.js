import { describe, it, expect } from 'vitest';
import buildLanguagePopulate from '../helpers/buildLanguagePopulate.js';
import languages from '../../../../config/languages.json' with { type: 'json' };

describe('buildLanguagePopulate', () => {
  it('builds a space-separated populate string for an array of fields', () => {
    const result = buildLanguagePopulate(['title']);
    Object.keys(languages).forEach((languageKey) => {
      expect(result).toContain(`${languageKey}-title`);
    });
  });

  it('handles multiple fields in the array form', () => {
    const result = buildLanguagePopulate(['title', 'body']);
    Object.keys(languages).forEach((languageKey) => {
      expect(result).toContain(`${languageKey}-title`);
      expect(result).toContain(`${languageKey}-body`);
    });
  });

  it('returns a populate object with path and language-prefixed populate when given an object form', () => {
    const result = buildLanguagePopulate({ path: 'scenarios', populate: ['name'] });
    expect(result.path).toBe('scenarios');
    Object.keys(languages).forEach((languageKey) => {
      expect(result.populate).toContain(`${languageKey}-name`);
    });
  });

  it('appends to an existing populate string when provided', () => {
    const result = buildLanguagePopulate(['title'], 'extra-field ');
    expect(result.startsWith('extra-field')).toBe(true);
  });

  it('trims trailing whitespace in the array form', () => {
    const result = buildLanguagePopulate(['title']);
    expect(result.endsWith(' ')).toBe(false);
  });
});
