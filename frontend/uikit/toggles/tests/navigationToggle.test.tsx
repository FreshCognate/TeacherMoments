import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NavigationToggle from '../components/navigationToggle';

const options = [
  { value: 'overview', text: 'Overview' },
  { value: 'details', text: 'Details' }
];

describe('NavigationToggle', () => {
  it('renders a button for each option', () => {
    render(<NavigationToggle value="overview" options={options} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
  });

  it('underlines only the selected option', () => {
    render(<NavigationToggle value="overview" options={options} onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveClass('border-b-primary-regular');
    expect(screen.getByRole('button', { name: 'Details' })).not.toHaveClass('border-b-primary-regular');
  });

  it('fires onClick with the option value when an option is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<NavigationToggle value="overview" options={options} onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Details' }));

    expect(onClick).toHaveBeenCalledWith('details');
  });
});
