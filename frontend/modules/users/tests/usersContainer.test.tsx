import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component: any) => Component
}));

let capturedProps: any = null;
vi.mock('../components/users', () => ({
  default: (props: any) => {
    capturedProps = props;
    return <div data-testid="users-stub" />;
  }
}));

import UsersContainer from '../containers/usersContainer';

const Container = UsersContainer as any;

const renderWithUsers = (users: any) => render(
  <Container users={{ query: { searchValue: '', currentPage: 1 }, data: [], ...users }} />
);

describe('UsersContainer', () => {
  beforeEach(() => {
    capturedProps = null;
  });

  it('says the page is for admins when the server refuses the list', () => {
    renderWithUsers({ status: 'error', response: { status: 401 } });
    expect(capturedProps.hasNoAccess).toBe(true);
  });

  it('does not blame access for a server error', () => {
    renderWithUsers({ status: 'error', response: { status: 500 } });
    expect(capturedProps.hasNoAccess).toBe(false);
  });

  it('does not blame access while the list loads', () => {
    renderWithUsers({ status: 'unresolved' });
    expect(capturedProps.hasNoAccess).toBe(false);
    expect(capturedProps.isLoading).toBe(true);
  });

  it('shows the empty search result to an admin whose search finds no one', () => {
    renderWithUsers({ status: 'success', response: { users: [], totalPages: 1 } });
    expect(capturedProps.hasNoAccess).toBe(false);
    expect(capturedProps.getEmptyAttributes().title).toBe('No users found');
  });
});
