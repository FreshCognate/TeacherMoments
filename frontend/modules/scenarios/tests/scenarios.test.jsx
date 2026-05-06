import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import Scenarios from '../components/scenarios';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

const seedApp = (data) => {
  resetCache('app');
  createCache({
    key: 'app',
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const baseProps = {
  scenarios: [],
  searchValue: '',
  currentPage: 1,
  totalPages: 1,
  actions: [],
  filter: undefined,
  filters: [],
  sortBy: undefined,
  sortByOptions: [],
  isSyncing: false,
  isLoading: false,
  isEditor: false,
  onSearchValueChange: () => {},
  onPaginationClicked: () => {},
  onFiltersChanged: () => {},
  onSortByChanged: () => {},
  onActionClicked: () => {},
  onDuplicateScenarioClicked: () => {}
};

const renderInRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

const scenario = {
  _id: 'scenario-1',
  name: 'Onboarding',
  collaborators: [{ user: 'user-1', role: 'OWNER' }],
  createdAt: '2025-01-15T00:00:00Z',
  updatedAt: '2025-02-01T00:00:00Z'
};

describe('Scenarios', () => {
  beforeEach(() => {
    seedApp({ language: 'en' });
  });

  it('renders the empty state when there are no scenarios and the user is an editor', () => {
    renderInRouter(<Scenarios {...baseProps} isEditor={true} />);
    expect(
      screen.getByText("You haven't created any Scenarios yet.")
    ).toBeInTheDocument();
  });

  it('does not render the empty state when the user is not an editor', () => {
    renderInRouter(<Scenarios {...baseProps} />);
    expect(
      screen.queryByText("You haven't created any Scenarios yet.")
    ).not.toBeInTheDocument();
  });

  it('renders a card and link per scenario when scenarios are present', () => {
    renderInRouter(<Scenarios {...baseProps} scenarios={[scenario]} />);
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /Onboarding/ })
    ).toHaveAttribute('href', '/scenarios/scenario-1/create');
  });

  it('renders Created and Last edited timestamps', () => {
    renderInRouter(<Scenarios {...baseProps} scenarios={[scenario]} />);
    expect(screen.getByText(/Created /)).toBeInTheDocument();
    expect(screen.getByText(/Last edited /)).toBeInTheDocument();
  });

  it('uses singular "collaborator" copy for one collaborator', () => {
    renderInRouter(<Scenarios {...baseProps} scenarios={[scenario]} />);
    expect(screen.getByText('1 collaborator')).toBeInTheDocument();
  });

  it('uses plural "collaborators" copy for multiple collaborators', () => {
    const scenarioWithTwo = {
      ...scenario,
      collaborators: [
        { user: 'user-1', role: 'OWNER' },
        { user: 'user-2', role: 'AUTHOR' }
      ]
    };
    renderInRouter(<Scenarios {...baseProps} scenarios={[scenarioWithTwo]} />);
    expect(screen.getByText('2 collaborators')).toBeInTheDocument();
  });

  it('fires onDuplicateScenarioClicked with the scenario id when the Copy button is clicked', async () => {
    const user = userEvent.setup();
    const onDuplicateScenarioClicked = vi.fn();

    renderInRouter(
      <Scenarios
        {...baseProps}
        scenarios={[scenario]}
        onDuplicateScenarioClicked={onDuplicateScenarioClicked}
      />
    );
    await user.click(screen.getByRole('button', { name: /Copy/ }));

    expect(onDuplicateScenarioClicked).toHaveBeenCalledWith('scenario-1');
  });
});
