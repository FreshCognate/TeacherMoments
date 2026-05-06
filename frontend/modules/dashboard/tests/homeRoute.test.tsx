import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const useOutletContextMock = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return { ...actual, useOutletContext: () => useOutletContextMock() };
});

vi.mock('../containers/dashboardContainer', () => ({
  default: () => <div data-testid="dashboard-stub">dashboard</div>
}));

vi.mock('~/modules/landing/containers/landingContainer', () => ({
  default: () => <div data-testid="landing-stub">landing</div>
}));

import HomeRoute from '../routes/homeRoute';

describe('HomeRoute', () => {
  beforeEach(() => {
    useOutletContextMock.mockReset();
  });

  it('renders LandingContainer when the user is not authenticated', () => {
    useOutletContextMock.mockReturnValue({ loaderData: { isAuthenticated: false, authentication: null } });
    render(<HomeRoute />);
    expect(screen.getByTestId('landing-stub')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-stub')).not.toBeInTheDocument();
  });

  it('renders DashboardContainer when the user is authenticated', () => {
    useOutletContextMock.mockReturnValue({ loaderData: { isAuthenticated: true, authentication: { user: {} } } });
    render(<HomeRoute />);
    expect(screen.getByTestId('dashboard-stub')).toBeInTheDocument();
    expect(screen.queryByTestId('landing-stub')).not.toBeInTheDocument();
  });

  it('renders LandingContainer when loaderData is missing', () => {
    useOutletContextMock.mockReturnValue({ loaderData: undefined });
    render(<HomeRoute />);
    expect(screen.getByTestId('landing-stub')).toBeInTheDocument();
  });
});
