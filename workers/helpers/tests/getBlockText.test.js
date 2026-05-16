import { describe, it, expect } from 'vitest';
import getBlockText from '../getBlockText.js';

describe('getBlockText', () => {
  it('returns the field text trimmed when present', () => {
    const block = {
      'en-US-body': [
        { type: 'paragraph', children: [{ text: '  Hello world  ' }] }
      ],
      name: 'fallback'
    };
    expect(getBlockText(block, 'body')).toBe('Hello world');
  });

  it('concatenates text across multiple nodes and recursive children', () => {
    const block = {
      'en-US-body': [
        { type: 'paragraph', children: [{ text: 'Hello ' }, { text: 'world' }] },
        { type: 'paragraph', children: [{ children: [{ text: '!' }] }] }
      ]
    };
    expect(getBlockText(block, 'body')).toBe('Hello world!');
  });

  it('falls back to block.name when the field is missing or not an array', () => {
    expect(getBlockText({ name: 'My block' }, 'body')).toBe('My block');
    expect(getBlockText({ 'en-US-body': 'oops', name: 'My block' }, 'body')).toBe('My block');
  });

  it('falls back to block.name when the slate is empty/whitespace', () => {
    const block = {
      'en-US-body': [{ type: 'paragraph', children: [{ text: '   ' }] }],
      name: 'My block'
    };
    expect(getBlockText(block, 'body')).toBe('My block');
  });

  it('returns an empty string when neither the field nor name has content', () => {
    expect(getBlockText({}, 'body')).toBe('');
    expect(getBlockText({ 'en-US-body': [{ children: [{ text: '' }] }] }, 'body')).toBe('');
  });
});
