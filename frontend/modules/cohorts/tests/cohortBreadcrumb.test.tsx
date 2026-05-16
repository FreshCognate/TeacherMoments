import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CohortBreadcrumb from '../components/cohortBreadcrumb';

const cohort = { _id: 'cohort-1', name: 'Spring Cohort' } as any;

const renderInRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CohortBreadcrumb', () => {
  it('always renders a link back to /cohorts', () => {
    renderInRouter(<CohortBreadcrumb cohort={cohort} routeId="overview" />);
    const cohortsLink = screen.getByRole('link', { name: 'Cohorts' });
    expect(cohortsLink).toHaveAttribute('href', '/cohorts');
  });

  it('renders the cohort name as plain text on the overview route', () => {
    renderInRouter(<CohortBreadcrumb cohort={cohort} routeId="overview" />);
    expect(screen.getByText('Spring Cohort')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Spring Cohort' })).not.toBeInTheDocument();
  });

  it('renders the cohort name as a link to the overview on nested routes', () => {
    renderInRouter(<CohortBreadcrumb cohort={cohort} routeId="users" />);
    const overviewLink = screen.getByRole('link', { name: 'Spring Cohort' });
    expect(overviewLink).toHaveAttribute('href', '/cohorts/cohort-1/overview');
  });

  it('renders the Users label on the users route', () => {
    renderInRouter(<CohortBreadcrumb cohort={cohort} routeId="users" />);
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders the Scenarios label on the scenarios route', () => {
    renderInRouter(<CohortBreadcrumb cohort={cohort} routeId="scenarios" />);
    expect(screen.getByText('Scenarios')).toBeInTheDocument();
  });

  it('renders the Settings label on the settings route', () => {
    renderInRouter(<CohortBreadcrumb cohort={cohort} routeId="settings" />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders the Responses label on the scenario route', () => {
    renderInRouter(<CohortBreadcrumb cohort={cohort} routeId="scenario" />);
    expect(screen.getByText('Responses')).toBeInTheDocument();
  });

  it('renders a Users link and the Responses label on the user route', () => {
    renderInRouter(<CohortBreadcrumb cohort={cohort} routeId="user" />);
    const usersLink = screen.getByRole('link', { name: 'Users' });
    expect(usersLink).toHaveAttribute('href', '/cohorts/cohort-1/users');
    expect(screen.getByText('Responses')).toBeInTheDocument();
  });

  it('truncates long cohort names', () => {
    const longCohort = { _id: 'cohort-1', name: 'a'.repeat(100) } as any;
    renderInRouter(<CohortBreadcrumb cohort={longCohort} routeId="overview" />);
    expect(screen.getByText(/a{40,60}\.\.\./)).toBeInTheDocument();
  });
});
