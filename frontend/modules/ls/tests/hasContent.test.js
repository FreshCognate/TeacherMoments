import { describe, it, expect } from 'vitest';
import hasContent from '../helpers/hasContent';

describe('hasContent', () => {
  it('returns false when the field is missing', () => {
    expect(hasContent({}, 'name')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(hasContent({ 'en-US-name': '' }, 'name')).toBe(false);
  });

  it('returns false for a whitespace-only string', () => {
    expect(hasContent({ 'en-US-name': '   ' }, 'name')).toBe(false);
  });

  it('returns true for a non-empty string', () => {
    expect(hasContent({ 'en-US-name': 'Hello' }, 'name')).toBe(true);
  });

  it('returns true when a slate array contains a non-empty text node', () => {
    const value = [{ children: [{ text: 'Hello' }] }];
    expect(hasContent({ 'en-US-name': value }, 'name')).toBe(true);
  });

  it('returns false when a slate array only contains empty text nodes', () => {
    const value = [{ children: [{ text: '' }, { text: '   ' }] }];
    expect(hasContent({ 'en-US-name': value }, 'name')).toBe(false);
  });

  it('reads the en-US-prefixed field regardless of the app language', () => {
    expect(hasContent({ 'en-name': 'Hello' }, 'name')).toBe(false);
    expect(hasContent({ 'en-US-name': 'Hello' }, 'name')).toBe(true);
  });
});
