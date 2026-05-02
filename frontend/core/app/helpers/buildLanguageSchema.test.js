import { describe, it, expect } from 'vitest';
import buildLanguageSchema from './buildLanguageSchema.js';
import languages from '../../../../config/languages.json';

describe('buildLanguageSchema', () => {
  it('returns one entry per language with the field name prefixed by the language key', () => {
    const fields = buildLanguageSchema('title', { type: 'String' });

    Object.keys(languages).forEach((languageKey) => {
      expect(fields[`${languageKey}-title`]).toBeDefined();
    });
    expect(Object.keys(fields)).toHaveLength(Object.keys(languages).length);
  });

  it('attaches an "ls" condition naming the language to each generated field', () => {
    const fields = buildLanguageSchema('title', { type: 'String' });

    expect(fields['en-US-title'].conditions).toEqual([
      { type: 'ls', language: 'en-US', shouldHideField: true }
    ]);
    expect(fields['de-DE-title'].conditions).toEqual([
      { type: 'ls', language: 'de-DE', shouldHideField: true }
    ]);
  });

  it('preserves any pre-existing conditions on the schema options', () => {
    const fields = buildLanguageSchema('title', {
      type: 'String',
      conditions: [{ type: 'modelValueIs', field: 'kind', values: ['foo'] }]
    });

    expect(fields['en-US-title'].conditions).toHaveLength(2);
    expect(fields['en-US-title'].conditions[0]).toEqual({
      type: 'modelValueIs',
      field: 'kind',
      values: ['foo']
    });
    expect(fields['en-US-title'].conditions[1]).toMatchObject({
      type: 'ls',
      language: 'en-US'
    });
  });
});
