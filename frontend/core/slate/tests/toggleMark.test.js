import { describe, it, expect } from 'vitest';
import { createEditor, Editor, Transforms } from 'slate';
import toggleMark, { isMarkActive } from '../helpers/toggleMark.js';

const buildEditor = () => {
  const editor = createEditor();
  editor.children = [{ type: 'paragraph', children: [{ text: 'hello' }] }];
  Transforms.select(editor, {
    anchor: { path: [0, 0], offset: 0 },
    focus: { path: [0, 0], offset: 5 }
  });
  return editor;
};

describe('toggleMark / isMarkActive', () => {
  it('isMarkActive returns false when the mark is not set', () => {
    const editor = buildEditor();
    expect(isMarkActive(editor, 'bold')).toBe(false);
  });

  it('toggleMark adds the mark when it is not active', () => {
    const editor = buildEditor();
    toggleMark(editor, 'bold');
    expect(isMarkActive(editor, 'bold')).toBe(true);
  });

  it('toggleMark removes the mark when it is already active', () => {
    const editor = buildEditor();
    toggleMark(editor, 'italic');
    toggleMark(editor, 'italic');
    expect(isMarkActive(editor, 'italic')).toBe(false);
  });

  it('different marks toggle independently', () => {
    const editor = buildEditor();
    toggleMark(editor, 'bold');
    toggleMark(editor, 'italic');

    expect(isMarkActive(editor, 'bold')).toBe(true);
    expect(isMarkActive(editor, 'italic')).toBe(true);

    toggleMark(editor, 'bold');
    expect(isMarkActive(editor, 'bold')).toBe(false);
    expect(isMarkActive(editor, 'italic')).toBe(true);
  });
});
