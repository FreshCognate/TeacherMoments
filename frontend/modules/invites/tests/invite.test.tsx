import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Invite from '../components/invite';

describe('Invite', () => {
  it('shows the checking state while the invite is checked', () => {
    render(<Invite isInviteNotFound={false} />);
    expect(screen.getByText('Checking invite...')).toBeInTheDocument();
  });

  it('says the invite link does not work, and what to do next', () => {
    render(<Invite isInviteNotFound={true} />);
    expect(screen.getByRole('heading', { name: "This invite link doesn't work." })).toBeInTheDocument();
    expect(
      screen.getByText('It may have been replaced by a newer link. Ask your facilitator for the current one.')
    ).toBeInTheDocument();
    expect(screen.queryByText('Checking invite...')).not.toBeInTheDocument();
  });
});
