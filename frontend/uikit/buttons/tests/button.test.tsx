import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './button';

describe('Button', () => {
  it('renders the text and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button text="Save" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies primary color classes when color is "primary"', () => {
    render(<Button text="Primary" color="primary" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('bg-black');
  });

  it('applies warning color classes when color is "warning"', () => {
    render(<Button text="Delete" color="warning" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveClass('bg-warning-regular');
  });

  it('disables the button when isDisabled is true', () => {
    render(<Button text="Save" isDisabled onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
