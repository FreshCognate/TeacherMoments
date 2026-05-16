import { describe, it, expect } from 'vitest';
import htmlToSlate from '../helpers/htmlToSlate.js';

const DEFAULT_SLATE = [{ type: 'paragraph', children: [{ text: '' }] }];

describe('htmlToSlate', () => {
  describe('empty input', () => {
    it('returns the default slate for empty/whitespace input', () => {
      expect(htmlToSlate('')).toEqual({ slate: DEFAULT_SLATE, images: [] });
      expect(htmlToSlate('   ')).toEqual({ slate: DEFAULT_SLATE, images: [] });
      expect(htmlToSlate(null)).toEqual({ slate: DEFAULT_SLATE, images: [] });
    });

    it('returns the default slate when no blocks were extracted', () => {
      const { slate, images } = htmlToSlate('<img src="https://x/a.png">');
      expect(slate).toEqual(DEFAULT_SLATE);
      expect(images).toEqual(['https://x/a.png']);
    });
  });

  describe('block tags', () => {
    it('maps p/h1-h6 to paragraph', () => {
      const { slate } = htmlToSlate('<h1>One</h1><p>Two</p><h3>Three</h3>');
      expect(slate).toEqual([
        { type: 'paragraph', children: [{ text: 'One' }] },
        { type: 'paragraph', children: [{ text: 'Two' }] },
        { type: 'paragraph', children: [{ text: 'Three' }] }
      ]);
    });

    it('maps blockquote', () => {
      const { slate } = htmlToSlate('<blockquote>quoted</blockquote>');
      expect(slate).toEqual([
        { type: 'blockquote', children: [{ text: 'quoted' }] }
      ]);
    });

    it('maps unordered lists', () => {
      const { slate } = htmlToSlate('<ul><li>one</li><li>two</li></ul>');
      expect(slate).toEqual([{
        type: 'bulletedList',
        children: [
          { type: 'listItem', children: [{ text: 'one' }] },
          { type: 'listItem', children: [{ text: 'two' }] }
        ]
      }]);
    });

    it('maps ordered lists', () => {
      const { slate } = htmlToSlate('<ol><li>one</li></ol>');
      expect(slate[0].type).toBe('numberedList');
    });

    it('flattens div/section/article wrappers', () => {
      const { slate } = htmlToSlate('<div><p>inside</p></div>');
      expect(slate).toEqual([
        { type: 'paragraph', children: [{ text: 'inside' }] }
      ]);
    });
  });

  describe('inline marks', () => {
    it('applies bold/strong as bold', () => {
      const { slate } = htmlToSlate('<p>plain <b>bold</b> <strong>strong</strong></p>');
      expect(slate[0].children).toEqual([
        { text: 'plain ' },
        { text: 'bold', bold: true },
        { text: ' ' },
        { text: 'strong', bold: true }
      ]);
    });

    it('applies italic/em as italic', () => {
      const { slate } = htmlToSlate('<p><i>i</i><em>e</em></p>');
      expect(slate[0].children).toEqual([
        { text: 'i', italic: true },
        { text: 'e', italic: true }
      ]);
    });

    it('applies underline / strike-through / code', () => {
      const { slate } = htmlToSlate('<p><u>u</u><s>s</s><code>c</code></p>');
      expect(slate[0].children).toEqual([
        { text: 'u', underline: true },
        { text: 's', strikethrough: true },
        { text: 'c', code: true }
      ]);
    });

    it('combines nested marks', () => {
      const { slate } = htmlToSlate('<p><b><i>both</i></b></p>');
      expect(slate[0].children).toEqual([
        { text: 'both', bold: true, italic: true }
      ]);
    });
  });

  describe('inline elements', () => {
    it('converts <br> in inline context to a newline', () => {
      const { slate } = htmlToSlate('<p>line1<br>line2</p>');
      expect(slate[0].children).toEqual([
        { text: 'line1' },
        { text: '\n' },
        { text: 'line2' }
      ]);
    });

    it('converts <a> to a link node with href props', () => {
      const { slate } = htmlToSlate('<p><a href="https://x">click</a></p>');
      expect(slate[0].children).toEqual([
        { type: 'link', props: { href: 'https://x' }, children: [{ text: 'click' }] }
      ]);
    });

    it('skips inline <img> tags', () => {
      const { slate, images } = htmlToSlate('<p>hello<img src="https://x/a.png"></p>');
      expect(slate[0].children).toEqual([{ text: 'hello' }]);
      expect(images).toEqual(['https://x/a.png']);
    });
  });

  describe('alignment', () => {
    it('extracts text-align from inline style', () => {
      const { slate } = htmlToSlate('<p style="text-align: center">x</p>');
      expect(slate[0].align).toBe('center');
    });

    it('extracts right and justify alignment', () => {
      const { slate: right } = htmlToSlate('<p style="text-align:right">x</p>');
      const { slate: justify } = htmlToSlate('<p style="text-align: justify">x</p>');
      expect(right[0].align).toBe('right');
      expect(justify[0].align).toBe('justify');
    });

    it('omits align when no relevant style is present', () => {
      const { slate } = htmlToSlate('<p>x</p>');
      expect(slate[0].align).toBeUndefined();
    });
  });

  describe('text decoding', () => {
    it('decodes HTML entities and normalises non-breaking spaces', () => {
      const { slate } = htmlToSlate('<p>&amp; and &lt;</p>');
      expect(slate[0].children[0].text).toBe('& and <');
    });
  });
});
