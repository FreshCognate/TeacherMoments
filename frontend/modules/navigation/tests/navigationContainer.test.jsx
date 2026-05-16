import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component) => Component
}));

const connectSocketsMock = vi.fn();
const disconnectSocketsMock = vi.fn();
vi.mock('~/core/sockets/helpers/connectSockets', () => ({ default: () => connectSocketsMock() }));
vi.mock('~/core/sockets/helpers/disconnectSockets', () => ({ default: () => disconnectSocketsMock() }));

const handleRequestErrorMock = vi.fn();
vi.mock('~/core/app/helpers/handleRequestError', () => ({ default: (err) => handleRequestErrorMock(err) }));

const addModalMock = vi.fn();
vi.mock('~/core/dialogs/helpers/addModal', () => ({ default: (config) => addModalMock(config) }));

vi.mock('~/modules/authentication/containers/loginDialogContainer', () => ({
  default: () => <div data-testid="login-dialog" />
}));

const axiosDeleteMock = vi.fn();
vi.mock('axios', () => ({
  default: { delete: (...args) => axiosDeleteMock(...args) }
}));

let capturedProps = null;
vi.mock('../components/navigation', () => ({
  default: (props) => {
    capturedProps = props;
    return <div data-testid="navigation-stub" />;
  }
}));

import NavigationContainer from '../containers/navigationContainer';

const buildAuth = (overrides = {}) => ({
  data: { _id: 'u-1', firstName: 'Sam', role: 'USER', ...overrides }
});

describe('NavigationContainer', () => {
  beforeEach(() => {
    capturedProps = null;
    connectSocketsMock.mockReset();
    disconnectSocketsMock.mockReset();
    handleRequestErrorMock.mockReset();
    addModalMock.mockReset();
    axiosDeleteMock.mockReset();
  });

  it('connects sockets on mount and disconnects on unmount', () => {
    const { unmount } = render(<NavigationContainer authentication={buildAuth()} />);
    expect(connectSocketsMock).toHaveBeenCalledTimes(1);

    unmount();
    expect(disconnectSocketsMock).toHaveBeenCalledTimes(1);
  });

  it('opens a Login dialog when login is clicked', () => {
    render(<NavigationContainer authentication={buildAuth()} />);
    capturedProps.onLoginClicked();

    expect(addModalMock).toHaveBeenCalledTimes(1);
    expect(addModalMock.mock.calls[0][0].title).toBe('Login');
  });

  it('toggles the mobile menu state', () => {
    render(<NavigationContainer authentication={buildAuth()} />);
    expect(capturedProps.isMobileMenuOpen).toBe(false);

    act(() => capturedProps.onMobileMenuToggle());
    expect(capturedProps.isMobileMenuOpen).toBe(true);

    act(() => capturedProps.onMobileMenuToggle());
    expect(capturedProps.isMobileMenuOpen).toBe(false);
  });

  it('sets the user menu open state', () => {
    render(<NavigationContainer authentication={buildAuth()} />);
    expect(capturedProps.isUserMenuOpen).toBe(false);

    act(() => capturedProps.onUserMenuToggle(true));
    expect(capturedProps.isUserMenuOpen).toBe(true);

    act(() => capturedProps.onUserMenuToggle(false));
    expect(capturedProps.isUserMenuOpen).toBe(false);
  });

  it('closes the user menu when an option is clicked', () => {
    render(<NavigationContainer authentication={buildAuth()} />);
    act(() => capturedProps.onUserMenuToggle(true));
    expect(capturedProps.isUserMenuOpen).toBe(true);

    act(() => capturedProps.onUserMenuOptionClicked('something-else'));
    expect(capturedProps.isUserMenuOpen).toBe(false);
  });

  it('logs out when the logout option is clicked', async () => {
    axiosDeleteMock.mockResolvedValue({});
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, assign: vi.fn() };

    render(<NavigationContainer authentication={buildAuth()} />);

    await act(async () => {
      capturedProps.onUserMenuOptionClicked('logout');
    });

    expect(disconnectSocketsMock).toHaveBeenCalled();
    expect(capturedProps.isLoggingOut).toBe(true);
    expect(axiosDeleteMock).toHaveBeenCalledWith('/api/authentication');

    window.location = originalLocation;
  });

  it('forwards logout request errors to handleRequestError', async () => {
    const error = new Error('boom');
    axiosDeleteMock.mockRejectedValue(error);

    render(<NavigationContainer authentication={buildAuth()} />);

    await act(async () => {
      capturedProps.onUserMenuOptionClicked('logout');
    });

    expect(handleRequestErrorMock).toHaveBeenCalledWith(error);
  });
});
