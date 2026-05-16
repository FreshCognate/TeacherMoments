import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FlatButton from '../components/flatButton';

describe('FlatButton', () => {
  it('renders the text and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<FlatButton text="Cancel" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('exposes the aria-label when provided', () => {
    render(<FlatButton icon="search" ariaLabel="Search" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('applies primary color classes when color is "primary"', () => {
    render(<FlatButton text="Next" color="primary" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('hover:text-primary-regular');
  });

  it('applies warning color classes when color is "warning"', () => {
    render(<FlatButton text="Delete" color="warning" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('hover:text-warning-regular');
  });
});
