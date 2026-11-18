import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component: any) => Component
}));
vi.mock('~/core/app/components/withRouter', () => ({
  default: (Component: any) => Component
}));

let capturedProps: any = null;
vi.mock('../components/cohort', () => ({
  default: (props: any) => {
    capturedProps = props;
    return <div data-testid="cohort-stub" />;
  }
}));

import CohortContainer from '../containers/cohortContainer';

const Container = CohortContainer as any;

const router = {
  params: { id: 'cohort-1' },
  matches: [{ id: 'root' }, { id: 'overview' }],
  navigate: vi.fn()
};

const renderWithCohort = (cohort: any) => render(<Container cohort={cohort} router={router} />);

describe('CohortContainer', () => {
  beforeEach(() => {
    capturedProps = null;
  });

  it('says there is no access when the server refuses the cohort', () => {
    renderWithCohort({ data: undefined, status: 'error', response: { status: 401 } });
    expect(capturedProps.hasNoAccess).toBe(true);
  });

  it('says the same when the cohort does not exist', () => {
    renderWithCohort({ data: undefined, status: 'error', response: { status: 404 } });
    expect(capturedProps.hasNoAccess).toBe(true);
  });

  it('does not blame access for a server error', () => {
    renderWithCohort({ data: undefined, status: 'error', response: { status: 500 } });
    expect(capturedProps.hasNoAccess).toBe(false);
  });

  it('shows the cohort once it loads', () => {
    renderWithCohort({ data: { _id: 'cohort-1', name: 'Spring Cohort' }, status: 'success' });
    expect(capturedProps.hasNoAccess).toBe(false);
    expect(capturedProps.isLoading).toBe(false);
    expect(capturedProps.pathValue).toBe('overview');
  });

  it('keeps the cohort on screen when a later save is refused', () => {
    renderWithCohort({ data: { _id: 'cohort-1', name: 'Spring Cohort' }, status: 'error', response: { status: 401 } });
    expect(capturedProps.hasNoAccess).toBe(false);
  });

  it('says there is no access when another cohort is still in the cache', () => {
    renderWithCohort({ data: { _id: 'cohort-2', name: 'Fall Cohort' }, status: 'error', response: { status: 401 } });
    expect(capturedProps.hasNoAccess).toBe(true);
  });
});
