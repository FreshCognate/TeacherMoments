import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../components/badge';

describe('Badge', () => {
  it('renders the text', () => {
    render(<Badge text="Beta" />);
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('renders an icon when icon prop is provided', () => {
    const { container } = render(<Badge text="Verified" icon="confirm" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('does not render an icon when icon prop is omitted', () => {
    const { container } = render(<Badge text="Plain" />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('applies primary color classes when color is "primary"', () => {
    const { container } = render(<Badge text="Primary" color="primary" />);
    expect(container.querySelector('.text-primary-regular')).toBeInTheDocument();
  });

  it('applies warning color classes when color is "warning"', () => {
    const { container } = render(<Badge text="Warning" color="warning" />);
    expect(container.querySelector('.text-warning-regular')).toBeInTheDocument();
  });
});
