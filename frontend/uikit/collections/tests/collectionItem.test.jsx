import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollectionItem from '../components/collectionItem.jsx';

describe('CollectionItem', () => {
  it('renders the name', () => {
    render(<CollectionItem id="1" name="Alpha" actions={[]} onActionClicked={() => {}} />);
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('renders meta items as "name: value" badges', () => {
    render(
      <CollectionItem
        id="1"
        name="Alpha"
        meta={[
          { name: 'Status', value: 'Published' },
          { name: 'Type', value: 'Scenario' }
        ]}
        actions={[]}
        onActionClicked={() => {}}
      />
    );

    expect(screen.getByText('Status: Published')).toBeInTheDocument();
    expect(screen.getByText('Type: Scenario')).toBeInTheDocument();
  });

  it('fires onActionClicked with itemId and action when an action is clicked', async () => {
    const user = userEvent.setup();
    const onActionClicked = vi.fn();

    render(
      <CollectionItem
        id="42"
        name="Alpha"
        actions={[{ icon: 'edit', text: 'Edit', action: 'edit' }]}
        onActionClicked={onActionClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onActionClicked).toHaveBeenCalledWith({ itemId: '42', action: 'edit' });
  });
});
