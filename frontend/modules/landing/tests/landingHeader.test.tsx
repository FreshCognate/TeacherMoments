import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LandingHeader from '../components/landingHeader';

describe('LandingHeader', () => {
  it('starts with the mobile menu closed', () => {
    render(<LandingHeader onAuthClicked={vi.fn()} />);
    const toggle = screen.getByRole('button', { name: 'Open menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the mobile menu when the hamburger is clicked', async () => {
    const user = userEvent.setup();
    render(<LandingHeader onAuthClicked={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const toggle = screen.getByRole('button', { name: 'Close menu' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the mobile menu when the hamburger is clicked again', async () => {
    const user = userEvent.setup();
    render(<LandingHeader onAuthClicked={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onAuthClicked when the desktop Sign in button is clicked', async () => {
    const user = userEvent.setup();
    const onAuthClicked = vi.fn();
    render(<LandingHeader onAuthClicked={onAuthClicked} />);

    const signInButtons = screen.getAllByRole('button', { name: 'Sign in' });
    await user.click(signInButtons[0]);

    expect(onAuthClicked).toHaveBeenCalledTimes(1);
  });

  it('calls onAuthClicked when the desktop Sign up button is clicked', async () => {
    const user = userEvent.setup();
    const onAuthClicked = vi.fn();
    render(<LandingHeader onAuthClicked={onAuthClicked} />);

    const signUpButtons = screen.getAllByRole('button', { name: 'Sign up' });
    await user.click(signUpButtons[0]);

    expect(onAuthClicked).toHaveBeenCalledTimes(1);
  });

  it('closes the mobile menu and triggers auth when a mobile menu item is clicked', async () => {
    const user = userEvent.setup();
    const onAuthClicked = vi.fn();
    render(<LandingHeader onAuthClicked={onAuthClicked} />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const signInButtons = screen.getAllByRole('button', { name: 'Sign in' });
    await user.click(signInButtons[signInButtons.length - 1]);

    expect(onAuthClicked).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute('aria-expanded', 'false');
  });
});
