import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from '../components/alert';

describe('Alert', () => {
  it('renders the body text', () => {
    render(<Alert text="Heads up" />);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
  });

  it('does not render an icon when type is omitted', () => {
    const { container } = render(<Alert text="No icon here" />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders an info icon when type is "info"', () => {
    const { container } = render(<Alert type="info" text="Info" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('.bg-primary-regular')).toBeInTheDocument();
  });

  it('renders a warning icon when type is "warning"', () => {
    const { container } = render(<Alert type="warning" text="Warn" />);
    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('.bg-warning-regular')).toBeInTheDocument();
  });

  it('does not render the action button when only actionText is provided', () => {
    render(<Alert text="Heads up" actionText="Retry" />);
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  it('does not render the action button when only onActionClicked is provided', () => {
    render(<Alert text="Heads up" onActionClicked={() => {}} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders the action button and fires onActionClicked when both props are provided', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();

    render(
      <Alert text="Heads up" actionText="Retry" onActionClicked={onActionClicked} />
    );

    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onActionClicked).toHaveBeenCalledTimes(1);
  });
});
