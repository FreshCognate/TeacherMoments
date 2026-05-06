import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Body from './body.jsx';

describe('Body', () => {
  it('renders the body html', () => {
    const { container } = render(<Body body="<em>Hello</em>" />);
    expect(container.querySelector('em')).toHaveTextContent('Hello');
  });

  it('returns null when body is an empty string', () => {
    const { container } = render(<Body body="" />);
    expect(container.firstChild).toBeNull();
  });

  it('applies the size class when a size is provided', () => {
    const { container } = render(<Body body="Hi" size="lg" />);
    expect(container.firstChild).toHaveClass('text-lg');
  });

  it('renders plain text content', () => {
    render(<Body body="Just text" />);
    expect(screen.getByText('Just text')).toBeInTheDocument();
  });
});
