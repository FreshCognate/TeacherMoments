import { describe, it, expect, vi } from 'vitest';

vi.mock('~/modules/ls/helpers/getString', () => ({
  default: ({ model }) => model['en-US-text'] || ''
}));

import getOptionLabel from '../helpers/getOptionLabel.js';

const options = [
  { _id: 'id-1', value: 'Agree', 'en-US-text': 'I agree' },
  { _id: 'id-2', value: '', 'en-US-text': 'No value option' }
];

describe('getOptionLabel', () => {
  it('resolves an _id to the option value', () => {
    expect(getOptionLabel({ options, optionId: 'id-1' })).toBe('Agree');
  });

  it('falls back to the localized text when the value is empty', () => {
    expect(getOptionLabel({ options, optionId: 'id-2' })).toBe('No value option');
  });

  it('resolves legacy value-based selections by value', () => {
    expect(getOptionLabel({ options, optionId: 'Agree' })).toBe('Agree');
  });

  it('returns the raw id when nothing matches', () => {
    expect(getOptionLabel({ options, optionId: 'gone' })).toBe('gone');
  });
});
