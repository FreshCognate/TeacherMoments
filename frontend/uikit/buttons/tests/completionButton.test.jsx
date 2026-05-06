import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CompletionButton from './completionButton.jsx';

describe('CompletionButton', () => {
  it('renders three buttons when status is IN_PROGRESS', () => {
    render(<CompletionButton status="IN_PROGRESS" onClick={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('renders two buttons when status is COMPLETE', () => {
    render(<CompletionButton status="COMPLETE" onClick={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('renders two buttons when status is INCOMPLETE', () => {
    render(<CompletionButton status="INCOMPLETE" onClick={() => {}} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('fires onClick when any of the buttons is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<CompletionButton status="COMPLETE" onClick={onClick} />);
    await user.click(screen.getAllByRole('button')[0]);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
