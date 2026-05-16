import { describe, it, expect } from 'vitest';
import buildSummaryFromComponents from '../helpers/buildSummaryFromComponents.js';

const DEFAULT_SUMMARY = [{ type: 'paragraph', children: [{ text: '' }] }];

describe('buildSummaryFromComponents', () => {
  it('returns the default summary when components is null/empty', () => {
    expect(buildSummaryFromComponents(null)).toEqual(DEFAULT_SUMMARY);
    expect(buildSummaryFromComponents([])).toEqual(DEFAULT_SUMMARY);
  });

  it('skips components without html or prompt', () => {
    expect(buildSummaryFromComponents([{ type: 'Other' }])).toEqual(DEFAULT_SUMMARY);
  });

  it('uses html when present', () => {
    const result = buildSummaryFromComponents([{ html: '<p>Hello</p>' }]);
    expect(result).toEqual([
      { type: 'paragraph', children: [{ text: 'Hello' }] }
    ]);
  });

  it('falls back to prompt when html is absent', () => {
    const result = buildSummaryFromComponents([{ prompt: '<p>Promptly</p>' }]);
    expect(result).toEqual([
      { type: 'paragraph', children: [{ text: 'Promptly' }] }
    ]);
  });

  it('concatenates slate output across components', () => {
    const result = buildSummaryFromComponents([
      { html: '<p>One</p>' },
      { html: '<p>Two</p>' }
    ]);
    expect(result).toEqual([
      { type: 'paragraph', children: [{ text: 'One' }] },
      { type: 'paragraph', children: [{ text: 'Two' }] }
    ]);
  });
});
