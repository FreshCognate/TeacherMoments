import { parse } from 'node-html-parser';
import he from 'he';

const DEFAULT_SLATE = [{ type: 'paragraph', children: [{ text: '' }] }];

function decodeText(text) {
  if (!text) return text;
  return he.decode(text).replace(/\u00a0/g, ' ');
}

const BLOCK_TAGS = {
  p: 'paragraph',
  h1: 'paragraph',
  h2: 'paragraph',
  h3: 'paragraph',
  h4: 'paragraph',
  h5: 'paragraph',
  h6: 'paragraph',
  blockquote: 'blockquote',
  ul: 'bulletedList',
  ol: 'numberedList',
  li: 'listItem',
};

const MARK_TAGS = {
  b: 'bold',
  strong: 'bold',
  i: 'italic',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  strike: 'strikethrough',
  del: 'strikethrough',
  code: 'code',
};

function getAlignment(node) {
  const style = node.getAttribute('style') || '';
  if (style.includes('text-align:center') || style.includes('text-align: center') || style.includes('justify-content:center') || style.includes('justify-content: center')) return 'center';
  if (style.includes('text-align:right') || style.includes('text-align: right')) return 'right';
  if (style.includes('text-align:justify') || style.includes('text-align: justify')) return 'justify';
  return null;
}

function processInlineChildren(node, marks = {}) {
  const results = [];

  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      const text = decodeText(child.rawText);
      if (text) {
        results.push({ text, ...marks });
      }
    } else if (child.nodeType === 1) {
      const tag = child.tagName?.toLowerCase();

      if (tag === 'br') {
        results.push({ text: '\n', ...marks });
      } else if (tag === 'a') {
        const href = child.getAttribute('href') || '';
        const children = processInlineChildren(child, marks);
        if (children.length === 0) children.push({ text: '' });
        results.push({ type: 'link', props: { href }, children });
      } else if (tag === 'img') {
        continue;
      } else if (MARK_TAGS[tag]) {
        const newMarks = { ...marks, [MARK_TAGS[tag]]: true };
        results.push(...processInlineChildren(child, newMarks));
      } else {
        results.push(...processInlineChildren(child, marks));
      }
    }
  }

  return results;
}

function extractImages(node) {
  const images = [];
  const imgTags = node.querySelectorAll('img');
  for (const img of imgTags) {
    const src = img.getAttribute('src');
    if (src) images.push(src);
  }
  return images;
}

function processNode(node) {
  const blocks = [];

  for (const child of node.childNodes) {
    if (child.nodeType === 3) {
      const text = decodeText(child.rawText).trim();
      if (text) {
        blocks.push({ type: 'paragraph', children: [{ text }] });
      }
    } else if (child.nodeType === 1) {
      const tag = child.tagName?.toLowerCase();

      if (tag === 'br') {
        blocks.push({ type: 'paragraph', children: [{ text: '' }] });
      } else if (tag === 'ul' || tag === 'ol') {
        const listType = BLOCK_TAGS[tag];
        const items = [];
        for (const li of child.childNodes) {
          if (li.nodeType === 1 && li.tagName?.toLowerCase() === 'li') {
            const children = processInlineChildren(li);
            items.push({ type: 'listItem', children: children.length > 0 ? children : [{ text: '' }] });
          }
        }
        if (items.length > 0) {
          blocks.push({ type: listType, children: items });
        }
      } else if (BLOCK_TAGS[tag]) {
        const slateType = BLOCK_TAGS[tag];
        const children = processInlineChildren(child);
        const block = {
          type: slateType,
          children: children.length > 0 ? children : [{ text: '' }]
        };
        const align = getAlignment(child);
        if (align) block.align = align;
        blocks.push(block);
      } else if (tag === 'div' || tag === 'section' || tag === 'article') {
        const nested = processNode(child);
        blocks.push(...nested);
      } else {
        const children = processInlineChildren(child);
        if (children.length > 0) {
          blocks.push({ type: 'paragraph', children });
        }
      }
    }
  }

  return blocks;
}

export default function htmlToSlate(html) {
  if (!html || !html.trim()) return { slate: DEFAULT_SLATE, images: [] };

  const root = parse(html);
  const images = extractImages(root);
  const blocks = processNode(root);

  if (blocks.length === 0) {
    return { slate: DEFAULT_SLATE, images };
  }

  return { slate: blocks, images };
}
