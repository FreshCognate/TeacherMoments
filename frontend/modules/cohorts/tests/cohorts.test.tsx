import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Cohorts from '../components/cohorts';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedCache = (key: string, data: any) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const baseProps = {
  cohorts: [] as any,
  actions: [],
  searchValue: '',
  currentPage: 1,
  totalPages: 1,
  filter: undefined,
  filters: [],
  sortBy: undefined,
  sortByOptions: [],
  isSyncing: false,
  isLoading: false,
  isEditor: false,
  onSearchValueChange: () => {},
  onFiltersChanged: () => {},
  onPaginationClicked: () => {},
  onSortByChanged: () => {},
  onActionClicked: () => {}
};

const renderInRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

const cohortAsEditor = {
  _id: 'cohort-1',
  name: 'Spring Cohort',
  collaborators: [{ user: 'user-1', role: 'OWNER' }],
  createdAt: '2025-01-15T00:00:00Z',
  updatedAt: '2025-02-01T00:00:00Z'
} as any;

const cohortAsViewer = {
  _id: 'cohort-2',
  name: 'Read-only Cohort',
  collaborators: []
} as any;

describe('Cohorts', () => {
  beforeEach(() => {
    seedCache('app', { language: 'en' });
    seedCache('authentication', { _id: 'user-1' });
  });

  it('renders the welcome instructions when there are no cohorts and the user is an editor', () => {
    renderInRouter(<Cohorts {...baseProps} isEditor={true} />);
    expect(
      screen.getByText('Welcome to Cohort Management')
    ).toBeInTheDocument();
    expect(
      screen.getByText("You haven't created any Cohorts yet.")
    ).toBeInTheDocument();
  });

  it('does not render the welcome instructions when the user is not an editor', () => {
    renderInRouter(<Cohorts {...baseProps} />);
    expect(
      screen.queryByText('Welcome to Cohort Management')
    ).not.toBeInTheDocument();
  });

  it('renders a card and link per cohort when cohorts are present', () => {
    renderInRouter(
      <Cohorts {...baseProps} cohorts={[cohortAsEditor, cohortAsViewer]} />
    );
    expect(screen.getByText('Spring Cohort')).toBeInTheDocument();
    expect(screen.getByText('Read-only Cohort')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Spring Cohort/ })
    ).toHaveAttribute('href', '/cohorts/cohort-1/overview');
  });

  it('renders the editor metadata footer for cohorts the user can edit', () => {
    renderInRouter(<Cohorts {...baseProps} cohorts={[cohortAsEditor]} />);
    expect(screen.getByText(/Created /)).toBeInTheDocument();
    expect(screen.getByText(/Last edited /)).toBeInTheDocument();
  });

  it('does not render the editor metadata footer for cohorts the user cannot edit', () => {
    renderInRouter(<Cohorts {...baseProps} cohorts={[cohortAsViewer]} />);
    expect(screen.queryByText(/Created /)).not.toBeInTheDocument();
    expect(screen.queryByText(/Last edited /)).not.toBeInTheDocument();
  });
});
