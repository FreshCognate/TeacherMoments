import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';

vi.mock('~/core/cache/containers/withCache', () => ({
  default: (Component: any) => Component
}));
vi.mock('~/core/app/components/withRouter', () => ({
  default: (Component: any) => Component
}));

let capturedProps: any = null;
vi.mock('~/modules/analytics/containers/analyticsContainer', () => ({
  default: (props: any) => {
    capturedProps = props;
    return <div data-testid="analytics-stub" />;
  }
}));

import CohortUserContainer from '../containers/cohortUserContainer';

const Container = CohortUserContainer as any;

const buildResponses = (searchValue: string) => ({
  data: [],
  status: 'resolved',
  query: { searchValue, currentPage: 1 },
  response: { totalPages: 1, user: { _id: 'user-1' } },
  setStatus: vi.fn(),
  setQuery: vi.fn(),
  fetch: vi.fn()
});

const router = { params: { id: 'cohort-1', userId: 'user-1' } };

describe('CohortUserContainer', () => {
  beforeEach(() => {
    capturedProps = null;
  });

  it('says the cohort has no scenarios when nothing is listed', () => {
    render(<Container cohortUserResponses={buildResponses('')} router={router} />);
    expect(capturedProps.viewType).toBe('byUserScenarios');
    expect(capturedProps.emptyBody).toBe('No scenarios in this cohort yet.');
  });

  it('leaves that line out while a search is on', () => {
    render(<Container cohortUserResponses={buildResponses('qa')} router={router} />);
    expect(capturedProps.emptyBody).toBeUndefined();
  });
});
