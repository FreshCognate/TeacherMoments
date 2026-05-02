import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActioningBar from './actioningBar.jsx';

const noop = () => {};

describe('ActioningBar', () => {
  it('renders the description text built from actionType and actionElement', () => {
    render(
      <ActioningBar
        isCreatingFromAction={false}
        actionType="duplicate"
        actionElement="scenario"
        onCancelActioningClicked={noop}
      />
    );

    expect(screen.getByText('Pick a place to duplicate the scenario to')).toBeInTheDocument();
  });

  it('renders the loading text mapped from actionType when isCreatingFromAction is true', () => {
    render(
      <ActioningBar
        isCreatingFromAction={true}
        actionType="duplicate"
        actionElement="scenario"
        onCancelActioningClicked={noop}
      />
    );

    expect(screen.getByText('Creating...')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
  });

  it('renders the loading text "Moving..." for the move action', () => {
    render(
      <ActioningBar
        isCreatingFromAction={true}
        actionType="move"
        actionElement="block"
        onCancelActioningClicked={noop}
      />
    );

    expect(screen.getByText('Moving...')).toBeInTheDocument();
  });

  it('renders a Cancel button when not creating, and fires onCancelActioningClicked when clicked', async () => {
    const user = userEvent.setup();
    const onCancelActioningClicked = vi.fn();

    render(
      <ActioningBar
        isCreatingFromAction={false}
        actionType="duplicate"
        actionElement="scenario"
        onCancelActioningClicked={onCancelActioningClicked}
      />
    );

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);
    expect(onCancelActioningClicked).toHaveBeenCalledTimes(1);
  });
});
