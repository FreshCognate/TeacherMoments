import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '../components/tooltip.jsx';

describe('Tooltip', () => {
  it('renders children unwrapped when no content is provided', () => {
    render(
      <Tooltip content="">
        <button type="button">Plain</button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: 'Plain' })).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows the tooltip on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Add slide" delay={0}>
        <button type="button">Add</button>
      </Tooltip>
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(screen.getByRole('button', { name: 'Add' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Add slide');
  });

  it('shows the tooltip on focus', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Add slide" delay={0}>
        <button type="button">Add</button>
      </Tooltip>
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Add' })).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Add slide');
  });
});
