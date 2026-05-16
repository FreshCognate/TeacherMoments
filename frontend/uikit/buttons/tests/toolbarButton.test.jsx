import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToolbarButton from '../components/toolbarButton.jsx';

describe('ToolbarButton', () => {
  it('renders the text and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<ToolbarButton text="Bold" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Bold' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders an icon when icon prop is provided', () => {
    const { container } = render(
      <ToolbarButton text="Bold" icon="confirm" onClick={() => {}} />
    );
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('disables the button when isDisabled is true', () => {
    render(<ToolbarButton text="Bold" isDisabled onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
