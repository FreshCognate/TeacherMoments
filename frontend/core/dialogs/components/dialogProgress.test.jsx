import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import DialogProgress from './dialogProgress.jsx';

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('DialogProgress', () => {
  it('renders an entry for each item with the provided text', () => {
    renderInRouter(
      <DialogProgress
        items={[
          { _id: 'a', text: 'Step one' },
          { _id: 'b', text: 'Step two' }
        ]}
        onCloseButtonClicked={() => {}}
      />
    );

    expect(screen.getByText('Step one')).toBeInTheDocument();
    expect(screen.getByText('Step two')).toBeInTheDocument();
  });

  it('wraps the text in a Link when item.link is provided', () => {
    const { container } = renderInRouter(
      <DialogProgress
        items={[{ _id: 'a', text: 'Open file', link: '/scenarios/123' }]}
        onCloseButtonClicked={() => {}}
      />
    );

    const anchor = container.querySelector('a');
    expect(anchor).toHaveAttribute('href', '/scenarios/123');
    expect(anchor).toHaveAttribute('target', '_blank');
  });

  it('renders a Close button when item.hasError is true and fires onCloseButtonClicked', async () => {
    const user = userEvent.setup();
    const onCloseButtonClicked = vi.fn();

    renderInRouter(
      <DialogProgress
        items={[{ _id: 'a', text: 'Failed', hasError: true }]}
        onCloseButtonClicked={onCloseButtonClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onCloseButtonClicked).toHaveBeenCalledTimes(1);
  });

  it('renders a status Badge when item.status is provided', () => {
    renderInRouter(
      <DialogProgress
        items={[{ _id: 'a', text: 'Uploading', status: 'In progress' }]}
        onCloseButtonClicked={() => {}}
      />
    );

    expect(screen.getByText('In progress')).toBeInTheDocument();
  });
});
