import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CohortParticipantScenariosItem from '../components/cohortParticipantScenariosItem';
import { createCache, resetCache } from '~/core/cache/helpers/cacheManager';

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

const scenario = {
  _id: 'scenario-1',
  name: 'Onboarding',
  'en-description': 'A short description'
} as any;

const baseProps = {
  scenario,
  run: null as any,
  onPlayScenarioClicked: () => {},
  onViewScenarioResponseClicked: () => {}
};

describe('CohortParticipantScenariosItem', () => {
  beforeEach(() => {
    seedCache('app', { language: 'en' });
    seedAsNonEditor();
  });

  it('renders the scenario name', () => {
    render(<CohortParticipantScenariosItem {...baseProps} />);
    expect(screen.getByText('Onboarding')).toBeInTheDocument();
  });

  it('renders the not-started status badge when no run is provided', () => {
    render(<CohortParticipantScenariosItem {...baseProps} />);
    expect(
      screen.getByText('This scenario has not been started')
    ).toBeInTheDocument();
  });

  it('renders the completed status badge when the run is complete', () => {
    render(
      <CohortParticipantScenariosItem
        {...baseProps}
        run={{ isComplete: true } as any}
      />
    );
    expect(
      screen.getByText('This scenario has been completed')
    ).toBeInTheDocument();
  });

  it('does not render the completion badge or View responses button for non-editors', () => {
    render(
      <CohortParticipantScenariosItem
        {...baseProps}
        completedCount={5}
        totalUsers={10}
      />
    );
    expect(
      screen.queryByText('5 / 10 users have completed this scenario')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /View responses/ })
    ).not.toBeInTheDocument();
  });

  it('renders the completion badge and View responses button for cohort editors', () => {
    seedAsCohortEditor();
    render(
      <CohortParticipantScenariosItem
        {...baseProps}
        completedCount={5}
        totalUsers={10}
      />
    );
    expect(
      screen.getByText('5 / 10 users have completed this scenario')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /View responses/ })
    ).toBeInTheDocument();
  });

  it('fires onPlayScenarioClicked with the scenario id when Run scenario is clicked', async () => {
    const user = userEvent.setup();
    const onPlayScenarioClicked = vi.fn();

    render(
      <CohortParticipantScenariosItem
        {...baseProps}
        onPlayScenarioClicked={onPlayScenarioClicked}
      />
    );
    await user.click(screen.getByRole('button', { name: /Run scenario/ }));
    expect(onPlayScenarioClicked).toHaveBeenCalledWith('scenario-1');
  });

  it('fires onViewScenarioResponseClicked with the scenario id when View responses is clicked', async () => {
    const user = userEvent.setup();
    const onViewScenarioResponseClicked = vi.fn();

    seedAsCohortEditor();
    render(
      <CohortParticipantScenariosItem
        {...baseProps}
        completedCount={5}
        totalUsers={10}
        onViewScenarioResponseClicked={onViewScenarioResponseClicked}
      />
    );
    await user.click(screen.getByRole('button', { name: /View responses/ }));
    expect(onViewScenarioResponseClicked).toHaveBeenCalledWith('scenario-1');
  });
});
