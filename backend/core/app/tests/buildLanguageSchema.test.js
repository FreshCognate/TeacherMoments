import { describe, it, expect } from 'vitest';
import buildLanguageSchema from '../helpers/buildLanguageSchema.js';
import languages from '../../../../config/languages.json' with { type: 'json' };

describe('buildLanguageSchema', () => {
  it('returns one field per configured language, prefixed by language key', () => {
    const result = buildLanguageSchema('title', { type: String });
    const expectedKeys = Object.keys(languages).map((key) => `${key}-title`);
    expect(Object.keys(result)).toEqual(expect.arrayContaining(expectedKeys));
    expect(Object.keys(result)).toHaveLength(expectedKeys.length);
  });

  it('spreads the provided schema options into each language field', () => {
    const result = buildLanguageSchema('title', { type: String, required: true });
    Object.keys(languages).forEach((languageKey) => {
      const field = result[`${languageKey}-title`];
      expect(field.type).toBe(String);
      expect(field.required).toBe(true);
    });
  });

  it('marks each generated field with its language and isTranslatable: true', () => {
    const result = buildLanguageSchema('body', { type: String });
    Object.keys(languages).forEach((languageKey) => {
      const field = result[`${languageKey}-body`];
      expect(field.language).toBe(languageKey);
      expect(field.isTranslatable).toBe(true);
    });
  });
});
