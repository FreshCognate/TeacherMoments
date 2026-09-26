import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Dashboard from '../components/dashboard';

const renderDashboard = () => render(
  <MemoryRouter>
    <Dashboard />
  </MemoryRouter>
);

describe('Dashboard', () => {
  it('renders the welcome heading', () => {
    renderDashboard();
    expect(screen.getByText('Welcome to Teacher Moments')).toBeInTheDocument();
  });

  it('highlights branching as the new feature', () => {
    renderDashboard();
    expect(screen.getByText(/New this school year — Branching scenarios/)).toBeInTheDocument();
    expect(screen.getByText(/🌿 Branching scenarios/)).toBeInTheDocument();
  });

  it('links to scenarios and cohorts', () => {
    renderDashboard();
    expect(screen.getByText('Browse & build scenarios').closest('a')).toHaveAttribute('href', '/scenarios');
    expect(screen.getByText('Set up your cohorts').closest('a')).toHaveAttribute('href', '/cohorts');
  });

  it('renders the "What\'s new" section with current features', () => {
    renderDashboard();
    expect(screen.getByText(/What’s new/)).toBeInTheDocument();
    expect(screen.getByText(/AI coaching feedback/)).toBeInTheDocument();
    expect(screen.getByText(/Rich response data/)).toBeInTheDocument();
  });
});
