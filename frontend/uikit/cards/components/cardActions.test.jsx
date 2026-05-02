import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardActions from './cardActions.jsx';

describe('CardActions', () => {
  it('returns null when no children are provided', () => {
    const { container } = render(<CardActions />);
    expect(container.firstChild).toBeNull();
  });

  it('renders its children when provided', () => {
    render(
      <CardActions>
        <button type="button">Open</button>
      </CardActions>
    );
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });
});
