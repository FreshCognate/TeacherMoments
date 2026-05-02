import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollectionEmpty from './collectionEmpty';

describe('CollectionEmpty', () => {
  it('renders the title and body', () => {
    render(
      <CollectionEmpty
        attributes={{ title: 'Empty', body: 'Add the first one' }}
      />
    );

    expect(screen.getByText('Empty')).toBeInTheDocument();
    expect(screen.getByText('Add the first one')).toBeInTheDocument();
  });

  it('does not render the action button when only attributes.action is provided', () => {
    render(
      <CollectionEmpty
        attributes={{
          title: 'Empty',
          body: 'Add the first one',
          action: { text: 'Create', action: 'create' }
        }}
      />
    );

    expect(screen.queryByRole('button', { name: 'Create' })).not.toBeInTheDocument();
  });

  it('renders the action button and fires onActionClicked when both are provided', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();

    render(
      <CollectionEmpty
        attributes={{
          title: 'Empty',
          body: 'Add the first one',
          action: { text: 'Create', action: 'create' }
        }}
        onActionClicked={onActionClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Create' }));
    expect(onActionClicked).toHaveBeenCalledWith({ action: 'create' });
  });

  it('renders the help text when provided', () => {
    render(
      <CollectionEmpty
        attributes={{
          title: 'Empty',
          body: 'Add the first one',
          help: 'Tip: you can import from CSV'
        }}
      />
    );

    expect(screen.getByText('Tip: you can import from CSV')).toBeInTheDocument();
  });
});
