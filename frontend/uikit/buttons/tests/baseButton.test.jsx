import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BaseButton from '../components/baseButton.jsx';

describe('BaseButton', () => {
  it('renders the text', () => {
    render(<BaseButton text="Save" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders the html when html prop is provided', () => {
    const { container } = render(<BaseButton html="<em>Saved</em>" onClick={() => {}} />);
    expect(container.querySelector('em')).toHaveTextContent('Saved');
  });

  it('renders the custom component when provided, overriding text and icon', () => {
    render(
      <BaseButton
        text="Ignored"
        icon="confirm"
        component={<span>Custom</span>}
        onClick={() => {}}
      />
    );

    expect(screen.getByText('Custom')).toBeInTheDocument();
    expect(screen.queryByText('Ignored')).not.toBeInTheDocument();
  });

  it('renders an icon when icon is provided', () => {
    const { container } = render(<BaseButton text="Confirm" icon="confirm" onClick={() => {}} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<BaseButton text="Save" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when isDisabled is true', () => {
    render(<BaseButton text="Save" isDisabled onClick={() => {}} />);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('applies aria-label, aria-controls, and title', () => {
    render(
      <BaseButton
        text="Open"
        ariaLabel="Open menu"
        ariaControls="menu-1"
        title="Show menu"
        onClick={() => {}}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Open menu');
    expect(button).toHaveAttribute('aria-controls', 'menu-1');
    expect(button).toHaveAttribute('title', 'Show menu');
  });
});
