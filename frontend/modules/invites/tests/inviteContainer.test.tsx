import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

vi.mock('~/core/app/components/withRouter', () => ({
  default: (Component: any) => Component
}));

vi.mock('../components/invite', () => ({
  default: () => <div data-testid="invite-stub" />
}));

const axiosPostMock = vi.fn();
vi.mock('axios', () => ({
  default: { post: (...args: any[]) => axiosPostMock(...args) }
}));

const handleRequestErrorMock = vi.fn();
vi.mock('~/core/app/helpers/handleRequestError', () => ({
  default: (err: any) => handleRequestErrorMock(err)
}));

const addModalMock = vi.fn();
vi.mock('~/core/dialogs/helpers/addModal', () => ({
  default: (config: any, callback: any) => addModalMock(config, callback)
}));

vi.mock('~/modules/authentication/containers/loginAndSignupDialogContainer', () => ({
  default: () => <div data-testid="login-and-signup-dialog" />
}));

vi.mock('~/modules/authentication/containers/loginDialogContainer', () => ({
  default: () => <div data-testid="login-dialog" />
}));

vi.mock('~/modules/authentication/containers/signupDialogContainer', () => ({
  default: () => <div data-testid="signup-dialog" />
}));

import InviteContainer from '../containers/inviteContainer';

const buildRouter = (overrides: any = {}) => ({
  params: { inviteId: 'invite-1' },
  navigate: vi.fn(),
  ...overrides
});

describe('InviteContainer', () => {
  beforeEach(() => {
    axiosPostMock.mockReset();
    handleRequestErrorMock.mockReset();
    addModalMock.mockReset();
  });

  it('posts the inviteId from the route params to /api/invites', () => {
    axiosPostMock.mockResolvedValue({ data: {} });
    const router = buildRouter({ params: { inviteId: 'abc-123' } });
    render(<InviteContainer router={router} />);
    expect(axiosPostMock).toHaveBeenCalledWith('/api/invites', { inviteId: 'abc-123' });
  });

  it('does not post when inviteId is missing from params', () => {
    const router = buildRouter({ params: {} });
    render(<InviteContainer router={router} />);
    expect(axiosPostMock).not.toHaveBeenCalled();
  });

  it('navigates to the cohort overview when the response has a cohort and user', async () => {
    axiosPostMock.mockResolvedValue({
      data: { cohort: { _id: 'cohort-9' }, user: { _id: 'user-1' } }
    });
    const router = buildRouter();
    render(<InviteContainer router={router} />);
    await waitFor(() => {
      expect(router.navigate).toHaveBeenCalledWith('/cohorts/cohort-9/overview');
    });
    expect(addModalMock).not.toHaveBeenCalled();
  });

  it('opens the login-and-signup modal when the response is missing cohort or user', async () => {
    axiosPostMock.mockResolvedValue({ data: { cohort: null, user: null } });
    const router = buildRouter();
    render(<InviteContainer router={router} />);
    await waitFor(() => {
      expect(addModalMock).toHaveBeenCalled();
    });
    const [config] = addModalMock.mock.calls[0];
    expect(config.title).toBe('Login or create an account');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('opens the login dialog when the user picks LOGIN from the action modal', async () => {
    axiosPostMock.mockResolvedValue({ data: {} });
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => expect(addModalMock).toHaveBeenCalled());

    const [, callback] = addModalMock.mock.calls[0];
    callback('ACTION', { type: 'LOGIN' });

    expect(addModalMock).toHaveBeenCalledTimes(2);
    expect(addModalMock.mock.calls[1][0].title).toBe('Login');
  });

  it('opens the signup dialog when the user picks CREATE from the action modal', async () => {
    axiosPostMock.mockResolvedValue({ data: {} });
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => expect(addModalMock).toHaveBeenCalled());

    const [, callback] = addModalMock.mock.calls[0];
    callback('ACTION', { type: 'CREATE' });

    expect(addModalMock).toHaveBeenCalledTimes(2);
    expect(addModalMock.mock.calls[1][0].title).toBe('Create an account');
  });

  it('ignores non-ACTION callback states', async () => {
    axiosPostMock.mockResolvedValue({ data: {} });
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => expect(addModalMock).toHaveBeenCalled());

    const [, callback] = addModalMock.mock.calls[0];
    callback('CLOSE', {});
    expect(addModalMock).toHaveBeenCalledTimes(1);
  });

  it('forwards request errors to handleRequestError', async () => {
    const error = new Error('boom');
    axiosPostMock.mockRejectedValue(error);
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => {
      expect(handleRequestErrorMock).toHaveBeenCalledWith(error);
    });
  });
});
