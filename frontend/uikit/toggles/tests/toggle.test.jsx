import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toggle from './toggle.jsx';

const options = [
  { value: 'on', text: 'On' },
  { value: 'off', text: 'Off' }
];

describe('Toggle', () => {
  it('renders a button for each option', () => {
    render(<Toggle value="on" options={options} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'On' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Off' })).toBeInTheDocument();
  });

  it('marks the selected option with the selected styling', () => {
    render(<Toggle value="on" options={options} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'On' })).toHaveClass('bg-lm-0');
    expect(screen.getByRole('button', { name: 'Off' })).not.toHaveClass('bg-lm-0');
  });

  it('fires onClick with the option value when an option is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Toggle value="on" options={options} onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Off' }));

    expect(onClick).toHaveBeenCalledWith('off');
  });
});
