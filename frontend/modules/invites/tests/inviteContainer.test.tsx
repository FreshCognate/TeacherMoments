import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

vi.mock('~/core/app/components/withRouter', () => ({
  default: (Component: any) => Component
}));

let capturedProps: any = null;
vi.mock('../components/invite', () => ({
  default: (props: any) => {
    capturedProps = props;
    return <div data-testid="invite-stub" />;
  }
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
    capturedProps = null;
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
    expect(capturedProps.isInviteNotFound).toBe(false);
  });

  it('opens the login-and-signup modal for a valid invite when no one is logged in', async () => {
    axiosPostMock.mockResolvedValue({ data: { cohort: { _id: 'cohort-9' } } });
    const router = buildRouter();
    render(<InviteContainer router={router} />);
    await waitFor(() => {
      expect(addModalMock).toHaveBeenCalled();
    });
    const [config] = addModalMock.mock.calls[0];
    expect(config.title).toBe('Log in or create an account');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(capturedProps.isInviteNotFound).toBe(false);
  });

  it('shows the checking state while the invite is checked', () => {
    axiosPostMock.mockReturnValue(new Promise(() => {}));
    render(<InviteContainer router={buildRouter()} />);
    expect(capturedProps.isInviteNotFound).toBe(false);
    expect(capturedProps.isInviteCheckFailed).toBe(false);
  });

  it('says the invite link does not work when no cohort comes back', async () => {
    axiosPostMock.mockResolvedValue({ data: {} });
    const router = buildRouter();
    render(<InviteContainer router={router} />);
    await waitFor(() => {
      expect(capturedProps.isInviteNotFound).toBe(true);
    });
    expect(capturedProps.isInviteCheckFailed).toBe(false);
    expect(addModalMock).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('says the same when the response names no cohort and no user', async () => {
    axiosPostMock.mockResolvedValue({ data: { cohort: null, user: null } });
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => {
      expect(capturedProps.isInviteNotFound).toBe(true);
    });
    expect(addModalMock).not.toHaveBeenCalled();
  });

  it('opens the login dialog when the user picks LOGIN from the action modal', async () => {
    axiosPostMock.mockResolvedValue({ data: { cohort: { _id: 'cohort-9' } } });
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => expect(addModalMock).toHaveBeenCalled());

    const [, callback] = addModalMock.mock.calls[0];
    callback('ACTION', { type: 'LOGIN' });

    expect(addModalMock).toHaveBeenCalledTimes(2);
    expect(addModalMock.mock.calls[1][0].title).toBe('Log in');
  });

  it('opens the signup dialog when the user picks CREATE from the action modal', async () => {
    axiosPostMock.mockResolvedValue({ data: { cohort: { _id: 'cohort-9' } } });
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => expect(addModalMock).toHaveBeenCalled());

    const [, callback] = addModalMock.mock.calls[0];
    callback('ACTION', { type: 'CREATE' });

    expect(addModalMock).toHaveBeenCalledTimes(2);
    expect(addModalMock.mock.calls[1][0].title).toBe('Create an account');
  });

  it('ignores non-ACTION callback states', async () => {
    axiosPostMock.mockResolvedValue({ data: { cohort: { _id: 'cohort-9' } } });
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
    expect(capturedProps.isInviteNotFound).toBe(false);
  });

  it('says the invite could not be checked when the server answers an error', async () => {
    const error = Object.assign(new Error('Request failed with status code 500'), {
      response: { status: 500, data: { message: 'Server error' } }
    });
    axiosPostMock.mockRejectedValue(error);
    const router = buildRouter();
    render(<InviteContainer router={router} />);
    await waitFor(() => {
      expect(capturedProps.isInviteCheckFailed).toBe(true);
    });
    expect(handleRequestErrorMock).toHaveBeenCalledWith(error);
    expect(capturedProps.isInviteNotFound).toBe(false);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('says the same when the request never reaches the server', async () => {
    axiosPostMock.mockRejectedValue(Object.assign(new Error('Network Error'), { response: undefined }));
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => {
      expect(capturedProps.isInviteCheckFailed).toBe(true);
    });
    expect(capturedProps.isInviteNotFound).toBe(false);
    expect(addModalMock).not.toHaveBeenCalled();
  });

  it('says the same when the server answers with no message', async () => {
    axiosPostMock.mockRejectedValue(Object.assign(new Error('Request failed with status code 502'), {
      response: { status: 502 }
    }));
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => {
      expect(capturedProps.isInviteCheckFailed).toBe(true);
    });
    expect(capturedProps.isInviteNotFound).toBe(false);
  });

  it('keeps the could-not-check message off when something fails after the check works', async () => {
    const error = new Error('navigation failed');
    axiosPostMock.mockResolvedValue({
      data: { cohort: { _id: 'cohort-9' }, user: { _id: 'user-1' } }
    });
    const router = buildRouter({ navigate: vi.fn(() => { throw error; }) });
    render(<InviteContainer router={router} />);
    await waitFor(() => {
      expect(handleRequestErrorMock).toHaveBeenCalledWith(error);
    });
    expect(capturedProps.isInviteCheckFailed).toBe(false);
  });

  it('keeps the could-not-check message off when the check works', async () => {
    axiosPostMock.mockResolvedValue({ data: { cohort: { _id: 'cohort-9' } } });
    render(<InviteContainer router={buildRouter()} />);
    await waitFor(() => expect(addModalMock).toHaveBeenCalled());
    expect(capturedProps.isInviteCheckFailed).toBe(false);
  });
});
