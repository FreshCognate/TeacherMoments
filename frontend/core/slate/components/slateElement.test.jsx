import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SlateElement from './slateElement.jsx';

const renderElement = (element) =>
  render(<SlateElement attributes={{}} element={element}>content</SlateElement>);

describe('SlateElement', () => {
  it('renders a paragraph by default', () => {
    const { container } = renderElement({ type: 'paragraph' });
    expect(container.firstChild.tagName).toBe('P');
  });

  it('renders a blockquote', () => {
    const { container } = renderElement({ type: 'blockquote' });
    expect(container.firstChild.tagName).toBe('BLOCKQUOTE');
  });

  it('renders an unordered list', () => {
    const { container } = renderElement({ type: 'bulletedList' });
    expect(container.firstChild.tagName).toBe('UL');
  });

  it('renders an ordered list', () => {
    const { container } = renderElement({ type: 'numberedList' });
    expect(container.firstChild.tagName).toBe('OL');
  });

  it('renders a list item', () => {
    const { container } = renderElement({ type: 'listItem' });
    expect(container.firstChild.tagName).toBe('LI');
  });

  it('renders an anchor with href and target="_blank" for link', () => {
    const { container } = renderElement({
      type: 'link',
      props: { href: 'https://example.com' }
    });
    const a = container.querySelector('a');
    expect(a).toHaveAttribute('href', 'https://example.com');
    expect(a).toHaveAttribute('target', '_blank');
  });

  it('applies textAlign and textIndent styles from element', () => {
    const { container } = renderElement({ type: 'paragraph', align: 'center', indent: 2 });
    expect(container.firstChild).toHaveStyle({ textAlign: 'center', textIndent: '32px' });
  });
});
