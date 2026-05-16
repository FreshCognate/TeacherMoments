import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Popover from '../components/popover.jsx';

describe('Popover', () => {
  it('returns null when no content is provided', () => {
    const { container } = render(<Popover content="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the default icon trigger when no children are provided', () => {
    render(<Popover content="Helpful info" />);
    const trigger = screen.getByRole('button', { name: 'More information' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the popover when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<Popover content="Helpful info" />);

    expect(screen.queryByText('Helpful info')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'More information' }));

    expect(await screen.findByText('Helpful info')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More information' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('uses provided children as the trigger', async () => {
    const user = userEvent.setup();
    render(
      <Popover content="Tip">
        <button type="button">Open</button>
      </Popover>
    );

    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(await screen.findByText('Tip')).toBeInTheDocument();
  });

  it('closes when pressing Escape', async () => {
    const user = userEvent.setup();
    render(<Popover content="Helpful info" />);

    await user.click(screen.getByRole('button', { name: 'More information' }));
    expect(await screen.findByText('Helpful info')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Helpful info')).not.toBeInTheDocument();
  });
});
