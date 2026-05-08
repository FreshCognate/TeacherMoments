import { describe, it, expect } from 'vitest';
import isSlateEmpty from '../helpers/isSlateEmpty.js';

describe('isSlateEmpty', () => {
  it('treats null/undefined/non-array values as empty', () => {
    expect(isSlateEmpty(null)).toBe(true);
    expect(isSlateEmpty(undefined)).toBe(true);
    expect(isSlateEmpty('text')).toBe(true);
    expect(isSlateEmpty([])).toBe(true);
  });

  it('treats whitespace-only paragraphs as empty', () => {
    const slate = [{ type: 'paragraph', children: [{ text: '   ' }] }];
    expect(isSlateEmpty(slate)).toBe(true);
  });

  it('treats nodes without children as empty', () => {
    const slate = [{ type: 'paragraph' }];
    expect(isSlateEmpty(slate)).toBe(true);
  });

  it('returns false when any leaf has non-whitespace text', () => {
    const slate = [{ type: 'paragraph', children: [{ text: 'hello' }] }];
    expect(isSlateEmpty(slate)).toBe(false);
  });

  it('recurses into nested element children', () => {
    const empty = [{
      type: 'list',
      children: [{ type: 'item', children: [{ text: '   ' }] }]
    }];
    const populated = [{
      type: 'list',
      children: [{ type: 'item', children: [{ text: 'thing' }] }]
    }];

    expect(isSlateEmpty(empty)).toBe(true);
    expect(isSlateEmpty(populated)).toBe(false);
  });
});
