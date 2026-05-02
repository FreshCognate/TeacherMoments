import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from './tooltip.jsx';

describe('Tooltip', () => {
  it('returns null when no content is provided', () => {
    const { container } = render(<Tooltip content="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the trigger button with aria-expanded false initially', () => {
    render(<Tooltip content="Helpful info" />);
    const button = screen.getByRole('button', { name: 'More information' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the tooltip content when the trigger is clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(<Tooltip content="<strong>Helpful</strong>" />);

    expect(container.querySelector('strong')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'More information' }));
    expect(container.querySelector('strong')).toHaveTextContent('Helpful');
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes when clicking outside', () => {
    const { container } = render(
      <div>
        <Tooltip content="Helpful info" />
        <button type="button">Outside</button>
      </div>
    );

    fireEvent.click(screen.getByRole('button', { name: 'More information' }));
    expect(screen.getByRole('button', { name: 'More information' })).toHaveAttribute('aria-expanded', 'true');

    fireEvent.mouseDown(screen.getByText('Outside'));
    expect(screen.getByRole('button', { name: 'More information' })).toHaveAttribute('aria-expanded', 'false');
  });
});
