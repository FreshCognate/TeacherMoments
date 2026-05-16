import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '../components/loading';

describe('Loading', () => {
  it('renders the spinning icon by default', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('renders the optional text when provided', () => {
    render(<Loading text="Saving..." />);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('does not render the text element when text is omitted', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('span')).not.toBeInTheDocument();
  });
});
