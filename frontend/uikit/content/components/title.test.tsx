import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Title from './title';

describe('Title', () => {
  it('renders the title html', () => {
    const { container } = render(<Title title="<strong>Heading</strong>" />);
    expect(container.querySelector('strong')).toHaveTextContent('Heading');
  });

  it('returns null when title is an empty string', () => {
    const { container } = render(<Title title="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders an h1 by default', () => {
    render(<Title title="Heading" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading');
  });

  it('renders the element specified by the element prop', () => {
    render(<Title title="Sub" element="h3" />);
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Sub');
  });

  it('applies the size class when a size is provided', () => {
    const { container } = render(<Title title="Heading" size="2xl" />);
    expect(container.firstChild).toHaveClass('text-2xl');
  });
});
