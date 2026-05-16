import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Users from '../components/users';

const baseProps = {
  users: [
    { _id: 'user-1', firstName: 'Alex', lastName: 'Doe' },
    { _id: 'user-2', firstName: 'Jamie', lastName: 'Smith' }
  ] as any,
  searchValue: '',
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  isSyncing: false,
  getItemAttributes: (item: any) => ({
    id: item._id,
    name: `${item.firstName} ${item.lastName}`
  }),
  getItemActions: () => [{ action: 'REMOVE', text: 'Remove' }],
  getEmptyAttributes: () => ({ title: 'No users yet', body: 'Invite some' }),
  onSearchValueChange: () => {},
  onPaginationClicked: () => {},
  onItemActionClicked: () => {}
};

describe('Users', () => {
  it('renders one row per user', () => {
    render(<Users {...baseProps} />);
    expect(screen.getByText('Alex Doe')).toBeInTheDocument();
    expect(screen.getByText('Jamie Smith')).toBeInTheDocument();
  });

  it('renders the empty state when there are no users', () => {
    render(<Users {...baseProps} users={[]} />);
    expect(screen.getByText('No users yet')).toBeInTheDocument();
  });

  it('fires onSearchValueChange when typing in the search box', async () => {
    const user = userEvent.setup();
    const onSearchValueChange = vi.fn();

    render(<Users {...baseProps} onSearchValueChange={onSearchValueChange} />);
    await user.type(screen.getByPlaceholderText('Search users...'), 'X');

    expect(onSearchValueChange).toHaveBeenCalledWith('X');
  });
});
