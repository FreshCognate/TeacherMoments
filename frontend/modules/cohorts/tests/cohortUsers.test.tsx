import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CohortUsers from '../components/cohortUsers';

const baseProps = {
  users: [
    { _id: 'user-1', firstName: 'Alex', lastName: 'Doe' }
  ] as any,
  cohortId: 'cohort-1',
  activeInvite: undefined,
  searchValue: '',
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  isSyncing: false,
  isCreatingInviteLink: false,
  getItemAttributes: (item: any) => ({
    id: item._id,
    name: `${item.firstName} ${item.lastName}`
  }),
  getItemActions: () => [],
  getEmptyAttributes: () => ({ title: 'No users yet', body: 'Invite some' }),
  onCreateInviteLinkClicked: () => {},
  onSearchValueChange: () => {},
  onPaginationClicked: () => {},
  onItemActionClicked: () => {}
};

describe('CohortUsers', () => {
  it('renders the section titles and intro copy', () => {
    render(<CohortUsers {...baseProps} />);
    expect(screen.getByText('Invite link')).toBeInTheDocument();
    expect(screen.getByText('Users in this Cohort')).toBeInTheDocument();
  });

  it('renders the Create invite link button when no active invite is present', () => {
    render(<CohortUsers {...baseProps} />);
    expect(
      screen.getByRole('button', { name: 'Create an invite link' })
    ).toBeInTheDocument();
  });

  it('disables the Create invite link button when isCreatingInviteLink is true', () => {
    render(<CohortUsers {...baseProps} isCreatingInviteLink={true} />);
    expect(
      screen.getByRole('button', { name: 'Create an invite link' })
    ).toBeDisabled();
  });

  it('fires onCreateInviteLinkClicked when the Create invite link button is clicked', async () => {
    const user = userEvent.setup();
    const onCreateInviteLinkClicked = vi.fn();

    render(
      <CohortUsers
        {...baseProps}
        onCreateInviteLinkClicked={onCreateInviteLinkClicked}
      />
    );
    await user.click(screen.getByRole('button', { name: 'Create an invite link' }));

    expect(onCreateInviteLinkClicked).toHaveBeenCalledTimes(1);
  });

  it('renders the share link instead of the Create button when an active invite is present', () => {
    render(
      <CohortUsers
        {...baseProps}
        activeInvite={{ token: 'invite-token' } as any}
      />
    );
    expect(
      screen.queryByRole('button', { name: 'Create an invite link' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(`${window.location.host}/invite/invite-token`)
    ).toBeInTheDocument();
  });

  it('renders the user list', () => {
    render(<CohortUsers {...baseProps} />);
    expect(screen.getByText('Alex Doe')).toBeInTheDocument();
  });
});
