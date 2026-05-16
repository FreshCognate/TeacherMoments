import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SlateLeaf from '../components/slateLeaf.jsx';

const renderLeaf = (leaf) =>
  render(<SlateLeaf attributes={{}} leaf={leaf}>text</SlateLeaf>);

describe('SlateLeaf', () => {
  it('renders a span with the children when no marks are active', () => {
    const { container } = renderLeaf({});
    expect(container.firstChild.tagName).toBe('SPAN');
    expect(container.firstChild).toHaveTextContent('text');
  });

  it('wraps in <strong> when leaf.bold is true', () => {
    const { container } = renderLeaf({ bold: true });
    expect(container.querySelector('strong')).toHaveTextContent('text');
  });

  it('wraps in <em> when leaf.italic is true', () => {
    const { container } = renderLeaf({ italic: true });
    expect(container.querySelector('em')).toHaveTextContent('text');
  });

  it('wraps in <u> when leaf.underline is true', () => {
    const { container } = renderLeaf({ underline: true });
    expect(container.querySelector('u')).toHaveTextContent('text');
  });

  it('wraps in <s> when leaf.strikethrough is true', () => {
    const { container } = renderLeaf({ strikethrough: true });
    expect(container.querySelector('s')).toHaveTextContent('text');
  });

  it('wraps in <code> when leaf.code is true', () => {
    const { container } = renderLeaf({ code: true });
    expect(container.querySelector('code')).toHaveTextContent('text');
  });

  it('combines multiple marks (bold + italic)', () => {
    const { container } = renderLeaf({ bold: true, italic: true });
    expect(container.querySelector('em')).toBeInTheDocument();
    expect(container.querySelector('strong')).toBeInTheDocument();
  });
});
