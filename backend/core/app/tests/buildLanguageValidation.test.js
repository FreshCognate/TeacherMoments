import { describe, it, expect } from 'vitest';
import buildLanguageValidation from '../helpers/buildLanguageValidation.js';
import languages from '../../../../config/languages.json' with { type: 'json' };

describe('buildLanguageValidation', () => {
  it('returns one entry per language, prefixed by language key', () => {
    const validation = { type: 'string' };
    const result = buildLanguageValidation('title', validation);
    const expectedKeys = Object.keys(languages).map((key) => `${key}-title`);
    expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
  });

  it('uses the same validation reference for every language entry', () => {
    const validation = { type: 'string', required: true };
    const result = buildLanguageValidation('title', validation);
    Object.keys(languages).forEach((languageKey) => {
      expect(result[`${languageKey}-title`]).toBe(validation);
    });
  });
});
