import { describe, it, expect } from 'vitest';
import getTextString from '../helpers/getTextString.js';

const paragraph = (children) => ({ type: 'paragraph', children });

describe('getTextString', () => {
  it('renders a plain paragraph with a span for the text', () => {
    const html = getTextString([paragraph([{ text: 'hello' }])]);
    expect(html).toBe('<p><span>hello</span></p>');
  });

  it('wraps bold text with the font-bold class', () => {
    const html = getTextString([paragraph([{ text: 'hello', bold: true }])]);
    expect(html).toContain('font-bold');
  });

  it('escapes HTML in text content', () => {
    const html = getTextString([paragraph([{ text: '<script>' }])]);
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('returns an empty string when the only block is an empty paragraph', () => {
    const html = getTextString([paragraph([{ text: '' }])]);
    expect(html).toBe('');
  });

  it('renders an empty paragraph between blocks as <br />', () => {
    const html = getTextString([
      paragraph([{ text: 'one' }]),
      paragraph([{ text: '' }]),
      paragraph([{ text: 'two' }])
    ]);
    expect(html).toContain('<br />');
  });

  it('renders bulleted lists as <ul>', () => {
    const html = getTextString([
      { type: 'bulletedList', children: [{ type: 'listItem', children: [{ text: 'item' }] }] }
    ]);
    expect(html).toContain('<ul');
    expect(html).toContain('<li>');
    expect(html).toContain('item');
  });

  it('renders numbered lists as <ol>', () => {
    const html = getTextString([
      { type: 'numberedList', children: [{ type: 'listItem', children: [{ text: 'item' }] }] }
    ]);
    expect(html).toContain('<ol');
  });

  it('renders blockquote', () => {
    const html = getTextString([
      { type: 'blockquote', children: [{ text: 'quoted' }] }
    ]);
    expect(html).toContain('<blockquote');
  });

  it('renders link with href and target="_blank"', () => {
    const html = getTextString([
      paragraph([
        { type: 'link', props: { href: 'https://example.com' }, children: [{ text: 'link' }] }
      ])
    ]);
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
  });

  it('uses a span tag instead of p when isTitle is true', () => {
    const html = getTextString([paragraph([{ text: 'title' }])], true);
    expect(html.startsWith('<span')).toBe(true);
  });

  it('applies indent as a text-indent style', () => {
    const html = getTextString([{ ...paragraph([{ text: 'x' }]), indent: 2 }]);
    expect(html).toContain('text-indent: 32px');
  });

  it('applies align as an editor-text-{align} class', () => {
    const html = getTextString([{ ...paragraph([{ text: 'x' }]), align: 'center' }]);
    expect(html).toContain('editor-text-center');
  });
});
