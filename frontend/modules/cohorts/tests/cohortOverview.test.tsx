import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

vi.mock('../containers/cohortParticipantScenariosContainer', () => ({
  default: () => <div data-testid="participant-scenarios-stub">participant scenarios</div>
}));
vi.mock('../containers/cohortCompletionStatsContainer', () => ({
  default: () => <div data-testid="completion-stats-stub">completion stats</div>
}));

import CohortOverview from '../components/cohortOverview';

const seedCache = (key: string, data: any) => {
  resetCache(key);
  createCache({
    key,
    cache: { getInitialData: () => data },
    container: { props: {} }
  });
};

const seedAsCohortEditor = () => {
  seedCache('authentication', { _id: 'user-1' });
  seedCache('cohort', {
    _id: 'cohort-1',
    collaborators: [{ user: 'user-1', role: 'OWNER' }]
  });
};

const seedAsNonEditor = () => {
  seedCache('authentication', { _id: 'user-1' });
  seedCache('cohort', { _id: 'cohort-1', collaborators: [] });
};

const cohort = { _id: 'cohort-1', name: 'Spring Cohort' } as any;

describe('CohortOverview', () => {
  beforeEach(() => {
    seedAsNonEditor();
  });

  it('renders the cohort title', () => {
    render(<CohortOverview cohort={cohort} onExportClicked={() => {}} />);
    expect(screen.getByText('Cohort: Spring Cohort')).toBeInTheDocument();
  });

  it('always renders the participant scenarios container', () => {
    render(<CohortOverview cohort={cohort} onExportClicked={() => {}} />);
    expect(screen.getByTestId('participant-scenarios-stub')).toBeInTheDocument();
  });

  it('does not render the Export button or completion stats for non-editors', () => {
    render(<CohortOverview cohort={cohort} onExportClicked={() => {}} />);
    expect(screen.queryByRole('button', { name: /Export CSV/ })).not.toBeInTheDocument();
    expect(screen.queryByTestId('completion-stats-stub')).not.toBeInTheDocument();
  });

  it('renders the Export button and completion stats for cohort editors', () => {
    seedAsCohortEditor();
    render(<CohortOverview cohort={cohort} onExportClicked={() => {}} />);
    expect(screen.getByRole('button', { name: /Export CSV/ })).toBeInTheDocument();
    expect(screen.getByTestId('completion-stats-stub')).toBeInTheDocument();
  });

  it('fires onExportClicked when the Export button is clicked', async () => {
    const user = userEvent.setup();
    const onExportClicked = vi.fn();

    seedAsCohortEditor();
    render(<CohortOverview cohort={cohort} onExportClicked={onExportClicked} />);
    await user.click(screen.getByRole('button', { name: /Export CSV/ }));

    expect(onExportClicked).toHaveBeenCalledTimes(1);
  });
});
