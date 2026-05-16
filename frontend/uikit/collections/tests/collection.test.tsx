import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Collection from '../components/collection';

const baseProps = {
  hasPagination: false,
  getItemAttributes: (item: { id: string; name: string }) => ({
    id: item.id,
    name: item.name,
    meta: []
  })
};

describe('Collection', () => {
  it('renders an item for each entry using getItemAttributes', () => {
    render(
      <Collection
        {...baseProps}
        items={[
          { id: '1', name: 'Alpha' },
          { id: '2', name: 'Beta' }
        ]}
      />
    );

    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('renders the empty state when items is empty and getEmptyAttributes is provided', () => {
    render(
      <Collection
        {...baseProps}
        items={[]}
        getEmptyAttributes={() => ({ title: 'Nothing here', body: 'Try adding one' })}
      />
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
    expect(screen.getByText('Try adding one')).toBeInTheDocument();
  });

  it('forwards item action clicks to onItemActionClicked with the item id and action', async () => {
    const user = userEvent.setup();
    const onItemActionClicked = vi.fn();

    render(
      <Collection
        {...baseProps}
        items={[{ id: '1', name: 'Alpha' }]}
        getItemActions={() => [{ action: 'edit', text: 'Edit' }]}
        onItemActionClicked={onItemActionClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onItemActionClicked).toHaveBeenCalledWith({ itemId: '1', action: 'edit' });
  });
});
