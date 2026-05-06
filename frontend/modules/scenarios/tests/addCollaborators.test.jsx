import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddCollaborators from '../components/addCollaborators';

const baseProps = {
  availableCollaborators: [
    { _id: 'user-1', firstName: 'Alex', lastName: 'Doe', email: 'alex@example.com' }
  ],
  selectedCollaborators: [],
  getItemAttributes: (item) => ({
    id: item._id,
    name: `${item.firstName} ${item.lastName}`
  }),
  getItemActions: () => [{ action: 'SELECT', text: 'Add' }],
  searchValue: '',
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  isSyncing: false,
  onSearchValueChange: () => {},
  onPaginationClicked: () => {},
  onItemActionClicked: () => {}
};

describe('AddCollaborators', () => {
  it('renders the available collaborators in the collection', () => {
    render(<AddCollaborators {...baseProps} />);
    expect(screen.getByText('Alex Doe')).toBeInTheDocument();
  });

  it('renders the empty state copy when no collaborators are selected', () => {
    render(<AddCollaborators {...baseProps} />);
    expect(
      screen.getByText('Select a collaborator to the list opposite.')
    ).toBeInTheDocument();
  });

  it('renders selected collaborators with their display name and email', () => {
    render(
      <AddCollaborators
        {...baseProps}
        selectedCollaborators={[
          { _id: 'user-1', firstName: 'Alex', lastName: 'Doe', email: 'alex@example.com' }
        ]}
      />
    );
    expect(screen.getAllByText('Alex Doe').length).toBeGreaterThan(0);
    expect(screen.getByText('alex@example.com')).toBeInTheDocument();
  });

  it('fires onItemActionClicked with SELECT and the user id when Remove is clicked on a selected collaborator', async () => {
    const user = userEvent.setup();
    const onItemActionClicked = vi.fn();

    render(
      <AddCollaborators
        {...baseProps}
        selectedCollaborators={[
          { _id: 'user-1', firstName: 'Alex', lastName: 'Doe', email: 'alex@example.com' }
        ]}
        onItemActionClicked={onItemActionClicked}
      />
    );

    await user.click(screen.getByRole('button', { name: /Remove/ }));

    expect(onItemActionClicked).toHaveBeenCalledWith({
      action: 'SELECT',
      itemId: 'user-1'
    });
  });
});
